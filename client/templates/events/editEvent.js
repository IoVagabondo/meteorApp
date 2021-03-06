
Session.setDefault('saveButton', 'Save Post');

Template.editEvent.helpers({
  saveButtonText: function(){
    return Session.get('saveButton');
  },
  
  initiatives: function(){
    return Initiatives.find({});

  },

  hasId: function() {
      return this._id;
  },
});


Template.editEvent.events({
    'submit form': function(e, tmpl){
        e.preventDefault();
        var form = e.target,
            user = Meteor.user(),
            _this = this; // we need this to reference the slug in the callback

        // Edit the post
        if(this._id) {

            Events.update(this._id, {$set: {
				        title:          form.title.value,
                description:    form.description.value,
                suggestedValue: form.suggestedValue.value,
                location:       form.location.value,
                initiative:     form.initiative.value

            }}, function(error) {
                if(error) {
                    // display the error to the user
                    alert(error.reason);
                } else {
                    // Redirect to the post
                    Router.go('Event', {slug: _this.slug});
                }
            });


        // SAVE
        } else {

            var slug = _.slugify(form.title.value);

			Meteor.call('insertEvent', {
				title: 			form.title.value,
				slug: 			slug,
				description: 	form.description.value,
				text: 			form.text.value,
                initiative:     form.initiative.value

			}, function(error, slug) {
				Session.set('saveButton', 'Save Post');

				if(error) {
					return alert(error.reason);
				}

				// Here we use the probably changed slug from the server side method
				Router.go('Event', {slug: slug});
			});

        }
    },

    'change #uploadImage' (event, template) {
        file = Modules.client.uploadToAmazonS3({ event: event, template: template, id: this._id }, function(id, url) {
            if (url) {
                if (id) {
                    Initiatives.update(id, {
                        $set: {
                            imageURL: url

                        }
                    }, function(error) {
                        if (error) {
                            Bert.alert(error.reason, "warning");
                        } else {
                            // TODO
                        }
                    });

                }

            }
        });
    },


});
