require "digest"
require 'ruby-debug'

enable :sessions
set :public_folder, File.join(File.dirname(__FILE__), 'public')

IMG_COUNT = 40
DEFAULT_TAGS = ["paris", "edbanger", "justice", "daftpunk", "uffie", "gainsbourg", "air", "m83", "kavinsky", "yelle", "cassius", "sebastiAn", "busyp", "oizo"]

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
  session.clear
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

post "/moar" do
  @images = []

  tags = params[:tags]

  if !tags.nil? && tags.first.empty?
    tags = DEFAULT_TAGS
  end

  #  if tags.nil? || tags.empty?
  #    @images = Instagram.media_popular.collect do |i| 
  #      i.images.thumbnail.url
  #    en
  #  else
  content = []

  pagination = params[:next_id]
  next_max_id = {}

  tags.each do |tag|

    if pagination.nil? || pagination[tag].nil? || pagination[tag].empty?
      tag_media = Instagram.tag_recent_media(tag, :count => IMG_COUNT)
    else
      tag_media = Instagram.tag_recent_media(tag, :count => IMG_COUNT, :max_id => pagination[tag])
      puts "#{tag} -- #{pagination[tag]}"
    end
    content << tag_media
    next_max_id[tag] = tag_media.pagination.next_max_id
  end

  IMG_COUNT.times do |i|
    content.each do |insta|
      if !insta.data[i].nil?
	@images << insta.data[i].images.thumbnail.url
      end
    end
  end
  #  end
  [next_max_id, @images].to_json
end

get "/tagged" do

  content = Instagram.tag_recent_media("ouiparis")
  hsh = {}
  if !content.data.empty?
    content.data.each { |dat| 
      hsh[dat.caption.created_time] = dat.images.standard_resolution.url 
    }

    hsh.to_json
  else
    ""
  end

end

def hsh(str)
  Digest::MD5.hexdigest(str)
end
