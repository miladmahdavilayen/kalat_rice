
import qrcode

# Replace this with your webpage address
webpage_address = "https://mahdavi-rice.com/"

# Generate a QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(webpage_address)
qr.make(fit=True)

# Create an image from the QR code instance
qr_image = qr.make_image(fill_color="black", back_color="white")

# Save the QR code image
qr_image.save("mrice_qr.png")

print("QR code generated and saved.")
