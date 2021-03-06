import os

def make_path_if_not_exists(filename):
    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
            with open(filename, "w") as f:
                # nothing
                return
        except OSError as exc: # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise
