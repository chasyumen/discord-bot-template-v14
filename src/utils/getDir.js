import { glob } from "glob";

export default async function (dir) {
    // var getDirectories = function (src, callback) {
    //     glob(src + '/**/*', callback);
    // };
    // return await new Promise(async (resolve, reject) => {
    //     getDirectories(dir, function (err, res) {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(res);
    //         }
    //     });
    // });
    var dirs = await glob(dir + '/**/*');
    return dirs.map(dirname => {return dirname.replace(/\\/g, "/")});
}