var CommentBox = React.createClass({

    /** Component Methods **/
    getInitialState: function() {
        return {
            setPolling: '',
            comments: [],
            loadComment: false
        }
    },

    getDefaultProps: function() {
        return { comments: [] }
    },

    loadCommentsFromServer: function() {
        $.getJSON(this.props.comments_path, (data) => { this.setState({ comments: data }),
            $('#comment-count').text(data.length)
        })
    },

    componentWillMount: function() {

            this.loadCommentsFromServer()
            this.setPolling = setInterval(this.loadCommentsFromServer, 3000)

    },

    componentWillUnmount: function()  {
        clearInterval(this.setPolling)
    },

    handleCommentSubmit: function(comment) {
        $.ajax({
            url: '/posts/'+this.props.post_id+'/comments',
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                $('#comment-count').text(data.length)
                this.setState({comments: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleRemoveComment: function(comment) {
        $.ajax({
           url: "/posts/" + this.props.post_id + "/comments/" + comment.id,
            dataType: 'json',
            type: 'DELETE',
            data: comment,
            success: function(data) {
                $('#comment-count').text(data.length)
                this.setState({comments: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    loadComments: function() {
        this.setState({loadComment: true})
        $('.loadcomments').remove()
    },

    render: function() {
        if(this.props.current_id !== -1)
          var  commentForm = <CommentForm onCommentSubmit={this.handleCommentSubmit} />
          var  buttonForm =  <div type="button" onClick={this.loadComments} className="large expanded secondary hollow button loadcomments">Show all comments</div>

        if(this.state.loadComment == true)
           var comments = this.state.comments.map( function(comment) {
                return <Comment current_id={this.props.current_id} commenter_id={comment.user_id}  deleteComment={this.handleRemoveComment} key={comment.id} id={comment.id} content={comment.content} time={comment.time_ago}
                                username={comment.user_username} avatar={comment.user_avatar_url} />
            }, this);

        return <div className="comment-box">
                 <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={400} transitionLeaveTimeout={200}>
                   { comments }
                 </ReactCSSTransitionGroup>
                 { commentForm }
                 { buttonForm }
              </div>
    }
})