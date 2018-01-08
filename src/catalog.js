// untested, still in progress

const Catalog = function(config){
  return {
    buf: '',
    FINISH_SIGNAL: '***FINISHED***',
    count: 0,
    db: null,

    pump() {
      while ((pos = buf.indexOf('  \}')) >= 0) { // keep going while there's a newline somewhere in the buffer
        processFicJson(buf.slice(0,pos+3)); // hand off the line
        buf = buf.slice(pos+3); // and slice the processed data off the buffer
      }

      // DEBUG: console.log(buf);

      if (buf.endsWith(FINISH_SIGNAL)) {
        db.close();
        console.log("Done processing " + this.count + " items.");
      }
    },

    insertDoc(fic, callback) {
      // Get the documents collection
      var collection = this.db.collection('docs');
      // Insert some documents
      collection.insertOne(fic, function(err, result) {
        assert.equal(err, null);
        callback(result);
      });
    },

    processFicJson(fic) {  // here's where we do something with a line
      fic = fic.trim()
      if (fic.startsWith(',')) {
        fic = fic.slice(1)
      }
      if (fic.length > 0) { // ignore empty lines
        var obj = JSON.parse(fic); // parse the JSON
        this.insertDoc(obj, () => {
          this.count++;
          console.log(this.count + ": " + obj['title']);
        });
      }
    },

    fillDbFromDisk() {
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server", db);
        this.db = db;

        var stream = fs.createReadStream(FF_JSON, {
          'flags' : 'r',
          'encoding' : 'utf-8'
        });

        stream.on('data', function(d) {
          this.buf += d.toString().replace('[', '').replace(']', '');
          // when data is read, stuff it in a string buffer
          this.pump();
        });

        stream.on('end', () => {
          buf += FINISH_SIGNAL;
          this.pump();
        });
      });
    }
  }
}

export default Catalog;
