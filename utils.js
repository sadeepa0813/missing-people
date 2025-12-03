// ===================================
// Utility Functions
// ===================================

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - The type of toast (success, danger, warning, info).
 */
function showToast(message, type = 'info') {
    const toastElement = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toastElement || !toastMessage) return;

    // Set message
    toastMessage.textContent = message;

    // Set toast type
    toastElement.className = `toast text-white bg-${type}`;

    // Show toast
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

/**
 * Compresses and resizes an image before uploading.
 * @param {File} file - The image file.
 * @param {number} maxWidth - The maximum width of the output image.
 * @param {number} maxHeight - The maximum height of the output image.
 * @param {number} quality - The quality of the output image (0 to 1).
 * @returns {Promise<Blob>} - A promise that resolves with the compressed image blob.
 */
function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress image
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };

        img.onerror = (err) => reject(err);
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Debounces a function, limiting the rate at which it can be called.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - The debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Formats a Firestore Timestamp into a human-readable date string.
 * @param {Timestamp} timestamp - The Firestore Timestamp.
 * @returns {string} - The formatted date string.
 */
function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Generates a CSV string from an array of objects.
 * @param {Array<Object>} data - The data to convert.
 * @param {Array<string>} headers - The headers for the CSV.
 * @returns {string} - The CSV string.
 */
function generateCSV(data, headers) {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
        return headers.map(header => {
            let value = row[header];
            if (value === null || value === undefined) {
                value = '';
            }
            // Escape quotes and wrap in double quotes if value contains a comma or newline
            value = String(value).replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n')) {
                value = `"${value}"`;
            }
            return value;
        }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Triggers a file download for a given content string.
 * @param {string} content - The content to download.
 * @param {string} fileName - The name of the file to download.
 * @param {string} mimeType - The MIME type of the content.
 */
function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
