function formDataToJson(formData) {
    const jsonObject = {};
    formData.forEach((value, key) => {
        jsonObject[key] = value;
    });
    return jsonObject;
}

export {
    formDataToJson
}