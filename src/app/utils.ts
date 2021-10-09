import {unzip, ZipInfo} from 'unzipit';
import {CodeFile} from './models';
import {Subject} from 'rxjs';

/**
 * Unzip codes from an arrayBuffer assuming that all of the zip entries are codes (i.e. texts)
 * @param arrayBuffer the content of the zipped file
 */
export async function unzipCodesArrayBuffer(arrayBuffer: ArrayBuffer) {
  const zipInfo: ZipInfo = await unzip(arrayBuffer);
  const submittedCodes: CodeFile[] = [];
  let codeIndex = 0;
  const numberOfCodes = Object.keys(zipInfo.entries).length;
  const waitForAllCodesUnzippedAndPushedIntoArray = new Subject<any>();

  for (const [fileName, entry] of Object.entries(zipInfo.entries)) {
    const reader = new FileReader();  // TODO, could the reader can be shared?
    reader.addEventListener('loadend', (e) => {
      const codeContent = e.target.result as string;
      submittedCodes.push(new CodeFile(codeIndex++, fileName, codeContent));
      if (submittedCodes.length === numberOfCodes) {
        waitForAllCodesUnzippedAndPushedIntoArray.complete();
      }
    });
    const codeBlob = await entry.blob();
    reader.readAsText(codeBlob);
  }


  await waitForAllCodesUnzippedAndPushedIntoArray.toPromise();
  return submittedCodes;
}
