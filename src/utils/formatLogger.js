export default function(title) {
    return function (type, ...content) {console.log(`[${title}-${type}]`, ...content)}
}