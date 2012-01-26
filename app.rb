require "digest"
require 'ruby-debug'

enable :sessions
set :public_folder, File.join(File.dirname(__FILE__), 'public')

CALLBACK_URL = "http://localhost:4567/oauth/callback"

ACCESS_TOKEN = "229814.9b4ac62.277dd0a52a054ec49e4746a1e1a36d7f"
Instagram.configure do |config|
  config.client_id = "9b4ac6296f9a440588de3fc63c3063e1"
  config.client_secret = "1bca67c52d9345db8573927f45b92aa6"
end

get "/" do

 # @images = Instagram.user_recent_media(229814, access_token: ACCESS_TOKEN, max_timestamp: 1323464798).collect { |i| i.images.thumbnail.url }
  erb :index
end

post "/" do
  if !params[:tags].empty?
    session[:tags] = params[:tags]
  else
    session[:tags] = nil
  end
end

get "/feed" do
  client = Instagram.client(:access_token => session[:access_token])
  user = client.user

  html = "<h1>#{user.username}'s recent photos</h1>"
  for media_item in client.user_recent_media
    html << "<img src='#{media_item.images.thumbnail.url}'>"
  end
  html
end

get "/moar" do
  @images = []
  if session[:tags].nil? || session[:tags].empty?
    @images = Instagram.media_popular.collect do |i| 
      i.images.thumbnail.url
    end
  else
    content = []
    session[:tags].each do |tag|
      content << Instagram.tag_recent_media(tag, :count => 20)
    end

    (0..19).each do |i|
      content.each do |insta|
	@images << insta.data[i].images.thumbnail.url
      end
    end
  end
  @images.to_json
end

post '/tagged' do
  require 'ruby-debug'
  debugger
  content = Instagram.tag_recent_media("edbanger")
  max_id = content.pagination.next_max_id

  content = Instagram.tag_recent_media("edbanger", :max_id => max_id)
  max_id = content.pagination.next_max_id

end

def hsh(str)
  Digest::MD5.hexdigest(str)
end
