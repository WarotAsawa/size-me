# SIZE-ME

**SIZE-ME** is a simple web-application which help you create a sizing for your Virtualization or Container Environment. **SIZE-ME** also provide very beautifil report and recommend a right sizing to spped up your work.

![Home Page](public/assets/img/home-sc.png?raw=true)

## Prerequisite

**SIZE-ME** runs on Node JS 12 and ReactJS 1.13 . You need to install NodeJS on your machine first. The other depencies and be found in **package.json** file. Simply use this command to install all dependencies.

    npm install

## How to run

Fist of all, you need to clone this repository.

    git clone https://github.com/WarotAsawa/kube-me.git

Then go into kube-me directory.

    cd size-me

Since **SIZE-ME** is a NodeJS Application, so you can use this command to run.

    npm start

## Using SIZE-ME

**SIZE-ME** use HTTP on port **3000**. Just open your browser and go to these URLs.

**Local Host**:

    http://localhost:3000

**Server:**

    http://<Server's IP Address>:3000



## Start Sizing your workloads

Open SIZE-ME and click on SIZER MENU to select tools. You can select either Virtuailization Sizer or Container Sizer. Here are some task that you need to do:

 1. **Workload Input**: Input one or more of your required workload with CPU, Memory and Storage Size.
 2. **Cluster Configuration**: Input your node's specification, number of nodes, node failure tolerance, over provisioning ratio.

Then, SIZE-ME will provide a total resources, overall utilization and sizing recommendation for you.

![App Page](public/assets/img/app-sc.png?raw=true)
