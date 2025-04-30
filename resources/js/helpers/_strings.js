function rtrim(str, ch) {
    let i = str.length - 1;

    while (ch === str.charAt(i) && i >= 0) i--

    return str.substring(0, i + 1);
}

export {
    rtrim
}