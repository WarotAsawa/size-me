export function CSVToArray(data) {
    let result = [];
    let lines = data.split("\n");
    let field = lines[0];
    for (let line=1; line < lines.length; line++) {
        let row = lines[line].split(',');
        let tempObj = {};
        for (let col=0; col < row.length; col++) {
            tempObj[field[col]] = row[col];
        }
        result.push(tempObj);
    }
    return result;
}