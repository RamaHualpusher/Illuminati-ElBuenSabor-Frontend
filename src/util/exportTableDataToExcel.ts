import { saveAs } from 'file-saver';
import { utils, writeFile } from 'xlsx';

export const exportTableDataToExcel = <T>(data: T[], filename: string) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");

    const wbout = writeFile(wb, `${filename}.xlsx`, { bookType: 'xlsx', type: 'binary' });
    if (wbout) {
        saveAs(new Blob([s2ab(wbout)]), 'test.xlsx');
      }
}

function s2ab(s: string) {
    if (!s) {
        return new ArrayBuffer(0); // Retorna un ArrayBuffer vacío si s es undefined
      }
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}