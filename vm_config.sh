#!/bin/bash

echo "Provisioning virtual machine..."

apt-get -qqy update
apt-get -qqy install python-pip

####### don't need this
#su postgres -c 'createuser -dRS vagrant'
#su vagrant -c 'createdb'
#su vagrant -c 'createdb forum'
#su vagrant -c 'psql forum -f /vagrant/forum/forum.sql'

vagrantTip="[35m[1mThe shared directory is located at /vagrant\nTo access your shared files: cd /vagrant(B[m"
echo -e $vagrantTip > /etc/motd

echo "Installing Git"
    apt-get install git -y > /dev/null

echo "Installing GCC"
	cd /usr/local
	wget https://launchpad.net/gcc-arm-embedded/4.9/4.9-2015-q3-update/+download/gcc-arm-none-eabi-4_9-2015q3-20150921-linux.tar.bz2
	sudo tar xjf gcc-arm-none-eabi-4_9-2015q3-20150921-linux.tar.bz2
	export CROSSDEV=/usr/local/gcc-arm-none-eabi-4_9-2015q3/bin/arm-none-eabi-
	cd -

#################
echo "Installing 32bit dependencies"
	sudo dpkg --add-architecture i386
	sudo apt-get update
	sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386

echo "downloading A051 SDK - TBD"

echo "ARTIK 051 Configuration"
	cd tizen_rt/os
	./config.sh artik051/artik051_debug


echo "Installing USB Drivers"
	apt-get install libftdi1

echo "Installing Virtual Box extension"
	sudo apt-get install -y virtualbox-ext-pack 

echo "Installing minicom"
	apt-get install -y minicom

echo "Provisioning complete !!!"