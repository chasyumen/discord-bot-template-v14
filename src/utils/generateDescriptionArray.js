export default function (object) {
    var newObj = [];
    Object.keys(object).forEach(key => {
        var newKey = key.replace(/_/g, "-");
        newObj.push({locale: newKey, string: object[key]})
        return ;
    });
    return newObj;
}