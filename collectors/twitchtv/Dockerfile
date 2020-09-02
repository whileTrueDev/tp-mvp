# Python support can be specified down to the minor or micro version
# (e.g. 3.6 or 3.6.3).
# OS Support also exists for jessie & stretch (slim and full).
# See https://hub.docker.com/r/library/python/ for all supported Python
# tags from Docker Hub.
FROM python:alpine

# If you prefer miniconda:
#FROM continuumio/miniconda3

LABEL Name=whiletrue-twitch-crawler Version=1.0.0

ENV PYTHON_ENV production

WORKDIR /app
ADD . /app

# Using pip:
RUN python3 -m pip install -r requirements.txt
CMD ["python3", "run.py"]

# # if want to collect only contracted creator data
# # you should use this code
# CMD ["python3", "-m", "twitch_crawler", "contracted"]

