#!/usr/bin/env python

import sys, os

def main(argv):
    if len(argv) is not 1:
        print "Please include directory parameter."
        sys.exit();
    else:
        ff_dir_path = argv[0]
        files = os.listdir(ff_dir_path)
        for f in files:
            ext = f[-3:len(f)]
            if ext == "txt":
                filename = "%s%s" % (ff_dir_path, f)
                print filename
                with open(filename, "r+") as chapter:
                    data = chapter.read()
                    doublespaced = data.replace("\n", "\n\n")
                    #print data
                    #print doublespaced
                    # TODO: check that its not already double-spaced 
                    # TODO: completely write over the filename
                    # seek to 0 then write?
                    chapter.write(doublespaced)

if __name__ == "__main__":
   main(sys.argv[1:])
