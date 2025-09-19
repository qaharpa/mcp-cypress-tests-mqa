import os
import glob

def load_feature_files(path):
    files = glob.glob(os.path.join(path, "**/*.feature"), recursive=True)
    return [(f, open(f, "r").read()) for f in files]

def load_step_definitions(path):
    files = glob.glob(os.path.join(path, "**/*.js"), recursive=True)
    return [(f, open(f, "r").read()) for f in files]
