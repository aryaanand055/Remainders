function getDay() {
    options = {
        weekday: "long",
        day: "2-digit",
        hour: "numeric",
        month: "short",
        minute: "numeric"
    }
    return new Date().toLocaleDateString("EN-us", options)
}