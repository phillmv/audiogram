require 'rubygems'
require 'bundler'
Bundler.setup

require 'sinatra'
require 'instagram'
require 'sinatra/base'
require File.join(File.dirname(__FILE__), 'app')
run Sinatra::Application

