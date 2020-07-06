const Axios = require('axios').default;

/**
 * Background Cloud Function that handles the 'google.storage.object.finalize'
 * event. It invokes the Malware Scanner service running in App Engine Flex
 * requesting a scan for the uploaded document.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.requestMalwareScan = async (data, context) => {

  const file = data;

  console.log(`  Event : ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);

  const url = process.env.SCAN_SERVICE_URL;

  try {
    if (context.eventType === "google.storage.object.finalize") {

      const res = await Axios.post(url, {
        location: `gs://${file.bucket}/${file.name}`,
        filename: file.name,
        bucketname: file.bucket
      });

      console.log(`Malware scan succeeded for: ${file.name}`);
      console.log(`Malware scan results:: ${res.data}`);

    } else {
      console.log('Malware scanning is only invoked when documents are uploaded or updated');
    }
  } catch (e) {
    console.error(`Error occurred while scanning ${file.name}`, e.data ? e.data : String(e));
  }
}