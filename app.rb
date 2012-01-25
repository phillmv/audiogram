require "digest"
enable :sessions
set :public_folder, File.join(File.dirname(__FILE__), 'public')

CALLBACK_URL = "http://localhost:4567/oauth/callback"

ACCESS_TOKEN = "229814.9b4ac62.277dd0a52a054ec49e4746a1e1a36d7f"
Instagram.configure do |config|
  config.client_id = "9b4ac6296f9a440588de3fc63c3063e1"
  config.client_secret = "1bca67c52d9345db8573927f45b92aa6"
end

get "/" do
  '<a href="/oauth/connect">Connect with Instagram</a>'

  @images = Instagram.user_recent_media(229814, access_token: ACCESS_TOKEN, max_timestamp: 1323464798).collect { |i| i.images.thumbnail.url }
#  @images = Instagram.media_popular.collect { |i| i.images.thumbnail.url }
  erb :index
end

get "/oauth/connect" do
  redirect Instagram.authorize_url(:redirect_uri => CALLBACK_URL)
end

get "/oauth/callback" do
  response = Instagram.get_access_token(params[:code], :redirect_uri => CALLBACK_URL)
  session[:access_token] = response.access_token
  redirect "/feed"
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
   @images = Instagram.media_popular.collect do |i| 
     url = i.images.thumbnail.url
     [url, hsh(url) ]
   end.to_json
   #erb :images, :layout => false
end

def hsh(str)
  Digest::MD5.hexdigest(str)
end
