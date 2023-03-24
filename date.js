exports.getTime = function () {
    return new Date().toLocaleDateString("EN-us", {
        minute: "2-digit",
        hour: "2-digit"
    })
}
exports.getDay = function () {
    return new Date().toLocaleDateString("EN-us", {
        weekday: "long",
        day: "2-digit",
        month: "short"
    })
}