// Import from /lib/pdf-parse.js to avoid the ENOENT bug
// The main pdf-parse module tries to read test/data/05-versions-space.pdf on import
import pdf from 'pdf-parse/lib/pdf-parse.js'

/**
 * Extracts raw text from a PDF buffer.
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} - The extracted text
 * @throws {Error} - If PDF parsing fails
 */
export async function extractTextFromPDF(buffer) {
    try {
        // Validate buffer
        if (!buffer || buffer.length === 0) {
            throw new Error("Invalid PDF buffer: buffer is empty")
        }

        // Check if buffer starts with PDF signature
        const pdfSignature = buffer.toString('utf-8', 0, 4)
        if (pdfSignature !== '%PDF') {
            throw new Error("Invalid PDF file: missing PDF signature")
        }

        // Parse PDF
        const data = await pdf(buffer, {
            // Options for better text extraction
            max: 0, // Parse all pages
        })

        if (!data || !data.text) {
            throw new Error("PDF parsing returned no text")
        }

        // Normalize and clean text
        const cleanText = normalizeText(data.text)

        return cleanText

    } catch (error) {
        console.error("PDF Parse Error:", error)

        // Provide more specific error messages
        if (error.message.includes("Invalid PDF")) {
            throw new Error("Failed to parse resume PDF: Invalid PDF format")
        }
        if (error.message.includes("password")) {
            throw new Error("Failed to parse resume PDF: Password-protected PDFs are not supported")
        }
        if (error.message.includes("encrypted")) {
            throw new Error("Failed to parse resume PDF: Encrypted PDFs are not supported")
        }

        throw new Error("Failed to parse resume PDF")
    }
}

/**
 * Normalizes extracted text by removing excessive whitespace and special characters
 * @param {string} text - Raw extracted text
 * @returns {string} - Normalized text
 */
function normalizeText(text) {
    return text
        // Remove null bytes and other control characters (except newlines and tabs)
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
        // Replace multiple newlines with double newline (preserve paragraph breaks)
        .replace(/\n{3,}/g, '\n\n')
        // Replace multiple spaces with single space
        .replace(/[ \t]{2,}/g, ' ')
        // Remove spaces at start/end of lines
        .replace(/^[ \t]+|[ \t]+$/gm, '')
        // Remove empty lines (more than 2 consecutive newlines)
        .replace(/\n{3,}/g, '\n\n')
        // Trim overall
        .trim()
}
