# Start from a Jupyter base image
FROM jupyter/minimal-notebook:latest

# Set the working directory inside the container
WORKDIR /home/jovyan/work

# Copy your environment file into the container
COPY environment.yml .

# Install conda packages
# 'mamba' is a faster conda replacement already included in Jupyter images
RUN mamba env update -n base -f environment.yml && \
    mamba clean --all -f -y

# Copy the rest of your repo
COPY . /home/jovyan/work

# Expose Jupyter port
EXPOSE 8888

# Run JupyterLab by default
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--allow-root"]