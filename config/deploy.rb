require "bundler/capistrano"

set :application, "audiogram"
set :repository,  "git@github.com:phillmv/audiogram.git"

set :scm, :git
set :use_sudo, false

set :deploy_to, "/var/www/audiogram/"

role :web, "okayfail.com"                          # Your HTTP server, Apache/etc
role :app, "okayfail.com"                          # This may be the same as your `Web` server
role :db,  "okayfail.com", :primary => true # This is where Rails migrations will run

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end
