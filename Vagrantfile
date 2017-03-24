# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  #config.vm.provision "shell", path: "vm_config.sh"

  config.vm.provision "shell", path: "vm_ext_config.sh"

  config.vm.box = "ubuntu/xenial64"
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 5000, host: 5000

  #config.vm.synced_folder "./", "/var/www", create: true, group: "www-data", owner: "www-data"
  config.vm.synced_folder "./", "/vagrant", create: true, group: "www-data", owner: "www-data"

  #config.vm.box_check_update = false
end

