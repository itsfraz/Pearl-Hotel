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
        const booking = await Booking.findById(bookingId).populate('user').populate('room');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check auth
        if (!booking.user || (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin)) {
            return res.status(401).json({ message: 'Not authorized to download this invoice' });
        }

        if (booking.status !== 'Confirmed' && booking.status !== 'Completed') {
             return res.status(400).json({ message: 'Invoice is only available for Confirmed or Completed bookings' });
        }

        // Find or create invoice
        let invoice = await Invoice.findOne({ booking: booking._id });
        if (!invoice) {
            invoice = await Invoice.create({
                booking: booking._id,
                user: booking.user._id,
                invoiceNumber: `INV-${booking._id.toString().substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                amount: booking.totalPrice,
                status: booking.paymentStatus === 'Paid' ? 'Paid' : 'Pending'
            });
        }

        // Generate PDF
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice.invoiceNumber}.pdf`);

        doc.pipe(res);

        // Header
        doc.fillColor('#444444')
           .fontSize(20)
           .text('Pearl Hotel', 50, 57)
           .fontSize(10)
           .text('123 Pearl Street', 200, 50, { align: 'right' })
           .text('Oceanview, CA 90210', 200, 65, { align: 'right' })
           .text('Phone: +1 234 567 890', 200, 80, { align: 'right' })
           .moveDown();

        doc.moveTo(50, 110).lineTo(550, 110).stroke();

        // Invoice Details
        doc.fontSize(20).text('INVOICE', 50, 130);
        doc.fontSize(10)
           .text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 160)
           .text(`Invoice Date: ${invoice.generatedAt.toLocaleDateString()}`, 50, 175)
           .text(`Booking ID: ${booking._id}`, 50, 190)
           .text(`Payment Status: ${booking.paymentStatus}`, 50, 205);

        // User Details
        const firstName = booking.user ? booking.user.firstName : 'Guest';
        const lastName = booking.user ? booking.user.lastName : '';
        const email = booking.user ? booking.user.email : '';
        const phone = booking.user ? (booking.user.phone || '') : '';

        doc.text('Bill To:', 300, 160)
           .font('Helvetica-Bold')
           .text(`${firstName} ${lastName}`, 300, 175)
           .font('Helvetica')
           .text(email, 300, 190)
           .text(phone, 300, 205);

        doc.moveTo(50, 230).lineTo(550, 230).stroke();

        // Booking Details Table
        let y = 250;
        doc.font('Helvetica-Bold')
           .text('Description', 50, y)
           .text('Dates', 250, y)
           .text('Amount', 450, y, { align: 'right' });
        
        doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
        doc.font('Helvetica');
        
        y += 25;
        
        const checkIn = new Date(booking.checkIn).toLocaleDateString();
        const checkOut = new Date(booking.checkOut).toLocaleDateString();
        const nights = Math.max(1, Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)));
        
        const roomName = booking.room ? booking.room.name : 'Room';
        
        let baseAmount = booking.totalPrice + (booking.discountAmount || 0);
        if (booking.addOns && booking.addOns.length > 0) {
            booking.addOns.forEach(addon => { baseAmount -= addon.totalPrice; });
        }
        
        doc.text(`${roomName} (${nights} nights)`, 50, y)
           .text(`${checkIn} - ${checkOut}`, 250, y)
           .text(`Rs. ${baseAmount}`, 450, y, { align: 'right' });

        y += 25;

        if (booking.addOns && booking.addOns.length > 0) {
             booking.addOns.forEach(addon => {
                 doc.text(`Add-on: ${addon.name}`, 50, y)
                    .text('-', 250, y)
                    .text(`Rs. ${addon.totalPrice}`, 450, y, { align: 'right' });
                 y += 20;
             });
        }

        if (booking.discountAmount > 0) {
            doc.text('Discount', 50, y)
               .text('-', 250, y)
               .text(`- Rs. ${booking.discountAmount}`, 450, y, { align: 'right' });
            y += 20;
        }

        doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
        y += 25;

        doc.font('Helvetica-Bold')
           .text('Total Amount:', 300, y)
           .text(`Rs. ${booking.totalPrice}`, 450, y, { align: 'right' });

        // Footer
        doc.fontSize(10)
           .font('Helvetica')
           .text('Thank you for choosing Pearl Hotel!', 50, 700, { align: 'center', width: 500 });

        doc.end();

    } catch (error) {
        console.error("Invoice generation error:", error);
        res.status(500).json({ message: "Error generating invoice" });
    }
};

module.exports = { downloadInvoice };
