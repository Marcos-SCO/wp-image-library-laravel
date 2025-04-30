function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];

            resolve({
                base64: base64Data,
                name: file.name,
                type: file.type
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Read file as data URL (base64)
    });
}

export {
    fileToBase64
}