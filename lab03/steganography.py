from PIL import Image

# ===== Helper functions =====

def text_to_bits(text: str) -> str:
    """Convert text into a binary string (sequence of 0s and 1s)."""
    return ''.join(f'{ord(c):08b}' for c in text)

def bits_to_text(bits: str) -> str:
    """Convert binary data back into text (8 bits = 1 character)."""
    chars = []
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        if len(byte) < 8:
            break
        chars.append(chr(int(byte, 2)))
    return ''.join(chars)

# Special marker to indicate end of hidden message
END_MARKER = "###"

# ===== Hide message =====

def hide_message(input_image_path: str, output_image_path: str, message: str):
    """Embed a text message into an image using LSB steganography."""
    full_message = message + END_MARKER
    bits = text_to_bits(full_message)

    img = Image.open(input_image_path)
    img = img.convert("RGB")
    pixels = img.load()

    width, height = img.size
    max_capacity = width * height * 3  # each color channel holds 1 bit

    if len(bits) > max_capacity:
        raise ValueError(f"Message too long. Max capacity: {max_capacity} bits, message size: {len(bits)} bits")

    bit_index = 0
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]

            new_rgb = []
            for channel in (r, g, b):
                if bit_index < len(bits):
                    # replace the least significant bit with our message bit
                    channel = (channel & ~1) | int(bits[bit_index])
                    bit_index += 1
                new_rgb.append(channel)

            pixels[x, y] = tuple(new_rgb)

            if bit_index >= len(bits):
                break
        if bit_index >= len(bits):
            break

    img.save(output_image_path)
    print(f"[OK] Message successfully hidden inside: {output_image_path}")


# ===== Extract message =====

def extract_message(stego_image_path: str) -> str:
    """Extract hidden text from a stego image."""
    img = Image.open(stego_image_path)
    img = img.convert("RGB")
    pixels = img.load()

    width, height = img.size

    bits = ""
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            for channel in (r, g, b):
                bits += str(channel & 1)

    # convert binary data to text
    text = bits_to_text(bits)

    end_idx = text.find(END_MARKER)
    if end_idx == -1:
        raise ValueError("End marker not found. Probably not a valid stego image.")
    return text[:end_idx]


if __name__ == "__main__":
    message = "Vadym Tkachenko, group 6.04.122.010.22.2, DOB 01.01.2005"
    hide_message("input.png", "stego_output.png", message)

    extracted = extract_message("stego_output.png")
    print("Extracted message:", extracted)
