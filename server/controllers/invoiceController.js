const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');

// @desc    Get invoice PDF for a booking
// @route   GET /api/invoices/:bookingId/download
// @access  Private
const downloadInvoice = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        
        // Find booking
        let booking = await Booking.findById(bookingId).populate('user').populate('room');
        let isSpa = false;

        if (!booking) {
            const SpaBooking = require('../models/SpaBooking');
            booking = await SpaBooking.findById(bookingId).populate('user').populate('service');
            if (booking) {
                isSpa = true;
            }
        }

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check auth
        if (!req.user.isAdmin && (!booking.user || booking.user._id.toString() !== req.user._id.toString())) {
            return res.status(401).json({ message: 'Not authorized to download this invoice' });
        }

        if (booking.status !== 'Confirmed' && booking.status !== 'Completed') {
             return res.status(400).json({ message: 'Invoice is only available for Confirmed or Completed bookings' });
        }

        const totalPrice = isSpa ? (booking.service?.price || 0) : booking.totalPrice;

        // Find or create invoice
        let invoice = await Invoice.findOne({ booking: booking._id });
        if (!invoice) {
            invoice = await Invoice.create({
                booking: booking._id,
                user: booking.user ? booking.user._id : null,
                invoiceNumber: `INV-${booking._id.toString().substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                amount: totalPrice,
                status: (booking.paymentStatus === 'Paid' || (isSpa && booking.status === 'Completed')) ? 'Paid' : 'Pending'
            });
        }

        // Generate PDF
        const doc = new PDFDocument({ margin: 50 });
        
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Length', Buffer.byteLength(pdfData));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`);
            res.send(pdfData);
        });

        // Header Logo (House)
        doc.fillColor('#E54D24') // Orange
           .polygon([90, 40], [120, 15], [150, 40]) // Roof
           .fill();
        doc.rect(95, 40, 50, 35).fill();
        doc.fillColor('#FFFFFF') // Window
           .rect(102, 48, 12, 12).fill()
           .rect(122, 48, 12, 12).fill()
           .rect(102, 63, 12, 12).fill()
           .rect(122, 63, 12, 12).fill();

        doc.strokeColor('#C3BA45') // Gold lines
           .lineWidth(3)
           .moveTo(50, 85).lineTo(190, 85).stroke()
           .moveTo(50, 93).lineTo(190, 93).stroke();

        doc.fillColor('#C3BA45')
           .font('Times-Italic')
           .fontSize(28)
           .text('pearl hotel', 50, 100, { width: 140, align: 'center' });

        // Company Details
        doc.fillColor('#000000')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('PEARL HOTEL', 400, 40, { align: 'right' })
           .font('Helvetica')
           .text('Pearl Hotel Ltd.', 400, 55, { align: 'right' })
           .text('123 Pearl Avenue', 400, 70, { align: 'right' })
           .text('Oceanview, CA 90210', 400, 85, { align: 'right' })
           .text('Phone: +1 234 567 890', 400, 100, { align: 'right' });

        // Title
        doc.moveDown(4);
        doc.font('Helvetica-Bold')
           .fontSize(18)
           .text(isSpa ? 'SPA INVOICE' : 'INVOICE', 0, 155, { align: 'center' });

        const generatedDate = invoice.generatedAt ? new Date(invoice.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const checkIn = isSpa ? new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A');
        const checkOut = isSpa ? booking.time : (booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A');
        
        const firstName = booking.user?.firstName || booking.guestName || 'Guest';
        const lastName = booking.user?.lastName || '';
        const email = booking.user?.email || booking.guestEmail || '';
        const phone = booking.user?.phone || '';

        // Left side: Bill To
        let topY = 210;
        doc.font('Helvetica-Bold').fontSize(10).text(`${firstName} ${lastName}`.trim(), 50, topY);
        doc.font('Helvetica');
        let currentY = topY + 15;
        if (email) { doc.text(email, 50, currentY); currentY += 15; }
        if (phone) { doc.text(phone, 50, currentY); currentY += 15; }
        // Generic address to match visual weight
        doc.text('Client Address on File', 50, currentY);

        // Right side: Meta details
        doc.font('Helvetica').text('Invoice Date:', 290, topY, { width: 100, align: 'right' });
        doc.font('Helvetica-Bold').text(generatedDate, 400, topY);
        
        doc.font('Helvetica').text('Booking:', 290, topY + 15, { width: 100, align: 'right' });
        doc.font('Helvetica-Bold').text(invoice.invoiceNumber?.split('-').pop() || bookingId.slice(-6).toUpperCase(), 400, topY + 15);
        
        doc.font('Helvetica').text(isSpa ? 'Appointment:' : 'Check In:', 290, topY + 30, { width: 100, align: 'right' });
        doc.font('Helvetica-Bold').text(checkIn, 400, topY + 30);
        
        doc.font('Helvetica').text(isSpa ? 'Time:' : 'Check Out:', 290, topY + 45, { width: 100, align: 'right' });
        doc.font('Helvetica-Bold').text(checkOut, 400, topY + 45);

        // Booking Details Header
        let y = 300;
        doc.font('Helvetica-Bold').fontSize(10).text(isSpa ? 'TREATMENT DETAILS' : 'BOOKING DETAILS', 50, y);
        y += 15;

        // Table Drawing Function
        const drawRow = (yPos, col1, col2, isBold = false) => {
            doc.strokeColor('#E0E0E0').lineWidth(1).moveTo(50, yPos).lineTo(550, yPos).stroke();
            doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10).fillColor('#000000');
            doc.text(col1, 55, yPos + 7);
            doc.text(col2, 445, yPos + 7, { width: 100, align: 'right' });
            return yPos + 25;
        };

        let nights = 1;
        if (!isSpa && booking.checkIn && booking.checkOut) {
            nights = Math.max(1, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)));
        }
        
        const roomName = isSpa ? (booking.service?.name || 'Spa Service') : (booking.room?.name || booking.room?.type || 'Room');
        
        let baseAmount = isSpa ? (booking.service?.price || 0) : ((booking.totalPrice || 0) + (booking.discountAmount || 0));
        if (!isSpa && booking.addOns && booking.addOns.length > 0) {
            booking.addOns.forEach(addon => { baseAmount -= (addon.totalPrice || 0); });
        }

        // Draw top border
        doc.strokeColor('#E0E0E0').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
        
        // Room Name and Base Price
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#000000');
        doc.text(`#1 ${roomName}`, 55, y + 7);
        doc.text(`Rs. ${baseAmount}`, 445, y + 7, { width: 100, align: 'right' });
        doc.font('Helvetica').fontSize(9).fillColor('#666666').text(`Rate: ${booking.status === 'Confirmed' ? 'Standard' : booking.status}`, 55, y + 20);
        doc.fillColor('#000000');
        y += 35;
        
        if (isSpa) {
            y = drawRow(y, 'Guests', `1`);
            y = drawRow(y, 'Duration', `${booking.service?.duration || 60} mins`);
        } else {
            y = drawRow(y, 'Adults', `${booking.adults || 1}`);
            y = drawRow(y, 'Nights', `${nights}`);
        }
        
        if (!isSpa && booking.addOns && booking.addOns.length > 0) {
            booking.addOns.forEach(addon => {
                y = drawRow(y, `Add-on: ${addon.name || 'Unknown'}`, `Rs. ${addon.totalPrice || 0}`);
            });
        }
        
        if (!isSpa && booking.discountAmount > 0) {
            y = drawRow(y, 'Discount', `- Rs. ${booking.discountAmount}`);
        }
        
        // Draw bottom border of the last standard row
        doc.strokeColor('#E0E0E0').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
        
        // Total row
        y += 5;
        doc.font('Helvetica-Bold').fontSize(11).fillColor('#000000');
        doc.text('TOTAL AMOUNT', 55, y + 7);
        doc.text(`Rs. ${totalPrice}`, 445, y + 7, { width: 100, align: 'right' });
        y += 25;
        doc.strokeColor('#E0E0E0').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();

        // Footer
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#888888')
           .text('Thank you for choosing Pearl Hotel! We hope you have a wonderful stay.', 50, 700, { align: 'center', width: 500 });

        doc.end();

    } catch (error) {
        console.error("Invoice generation error:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error generating invoice: " + error.message });
        } else {
            res.end();
        }
    }
};

module.exports = { downloadInvoice };
