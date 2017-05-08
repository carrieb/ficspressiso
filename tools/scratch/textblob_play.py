#!/usr/bin/env python
import sys
from textblob import TextBlob

def main(argv):
    # For now, just open up the first chapter of The Debt of Time
    with open('/Users/carolyn/Desktop/fanfiction/The Debt of Time/125. Chapter 125.txt', 'r') as f:
        raw_file = f.read()
        decoded = raw_file.decode('utf-8')
        blob = TextBlob(decoded)
        phrases = {}
        for noun_phrase in blob.noun_phrases:
            if noun_phrase not in phrases:
                phrases[noun_phrase] = 0
            phrases[noun_phrase] +=1
        for p in phrases.keys():
            if phrases[p] > 3:
                print p, phrases[p]

        # for sentence in blob.sentences:
        #     print sentence
        #     print sentence.sentiment.polarity
        # This doesn't work very well... 

if __name__ == "__main__":
   main(sys.argv[1:])
