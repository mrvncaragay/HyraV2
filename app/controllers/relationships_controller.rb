class RelationshipsController < ApplicationController
  before_action :authenticate_user!
  before_action :get_user, only: [:create, :destroy]

  def create
    current_user.follow(@user)
    respond_to do |format|
      format.html { redirect_to user_url(id: @user.username) }
      format.js
    end

  end

  def destroy
    current_user.unfollow(@user)
    respond_to do |format|
      format.html { redirect_to user_url(id: @user.username) }
      format.js
    end
  end

  private

  def get_user
    @user = User.find(params[:id])
  end
end