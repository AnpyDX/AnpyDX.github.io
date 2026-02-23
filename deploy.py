import os
import sys
import shutil
import subprocess

WEBSITE_DIST = "dist"
GITHUB_PAGES_TEMP = "page-workspace"
GITHUB_PAGES_REPO = "https://github.com/anpydx/AnpyDX.github.io"

def run_cmd_or_exit(stage: str, cmd: list[str], cwd: str = "."):
    if sys.platform == "win32":
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd, shell=True, encoding='utf-8')
    else:
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    
    if result.returncode:
        print(f"Failed to {stage}, due to following errors: \n{result.stderr}")
        exit(result.returncode)


""" Check Environments """
if not os.path.exists("package.json"):
    raise RuntimeError("Invalid workdir! Please run this script next to `package.json`.")
if not os.path.exists(WEBSITE_DIST):
    raise RuntimeError(f"Failed to find website source directory: \"{WEBSITE_DIST}\"")

""" Clone GitHub Pages repo """
try:
    print("Clone GitHub Pages...")

    run_cmd_or_exit("clone GitHub Pages", ['git', 'clone', GITHUB_PAGES_REPO, GITHUB_PAGES_TEMP])

    print("> Finish!")
except Exception as e:
    raise RuntimeError(f"Internal error occurred while cloning GitHub Pages: {str(e)}")

""" Copy & Commit New Website """
try:
    print("Commit new website...")

    for filename in os.listdir(GITHUB_PAGES_TEMP):
        if filename != ".git":
            path = os.path.join(GITHUB_PAGES_TEMP, filename)
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)

    run_cmd_or_exit("git.add delete ops", ['git', 'add', '.'], GITHUB_PAGES_TEMP)
    run_cmd_or_exit("git.commit delete ops", ['git', 'commit', '-m', "delete old website"], GITHUB_PAGES_TEMP)

    distdir = WEBSITE_DIST
    for filename in os.listdir(distdir):
        src = os.path.join(distdir, filename)
        dst = os.path.join(GITHUB_PAGES_TEMP, filename)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)

    run_cmd_or_exit("git.add copy ops", ['git', 'add', '.'], GITHUB_PAGES_TEMP)
    run_cmd_or_exit("git.commit copy ops", ['git', 'commit', '-m', "add new website"], GITHUB_PAGES_TEMP)

    print("> Finish!")
except Exception as e:
    raise RuntimeError(f"Internal error occurred while commiting new webite: {str(e)}")

""" Push GitHub Pages """
try:
    print("Push GitHub Pages...")

    run_cmd_or_exit("push GitHub Pages", ['git', 'push'], GITHUB_PAGES_TEMP)

    print("> Finish!")
except Exception as e:
    raise RuntimeError(f"Internal error occurred while pushing GitHub Pages: {str(e)}")


""" Cleaning Up """
print(f"Deploy done. Please cleaning up `{GITHUB_PAGES_TEMP}` manually.")