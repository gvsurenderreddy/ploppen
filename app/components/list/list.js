'use strict';

angular.module('node-teiler.list', [])

    .controller('ListController', ['$scope', 'PeerList', 'Peer', 'PeerDiscoveryBroadcaster', 'PeerDiscoveryListener', 'FileTransferServer', function($scope, PeerList, Peer, PeerDiscoveryBroadcaster, PeerDiscoveryListener, FileTransferServer) {

        $scope.myPeer = Peer.myPeer();

        $scope.peers = PeerList.list();

        $scope.$on('update peers', function() {

            $scope.$apply();

        });

		/*
        function setDialogListener(name) {

            var inputListener = $('#' + name + 'fileInputDialog');
            var saveListener = $('#' + name + 'fileSaveDialog');

            inputListener.change(function(evt) {

                var filePath = $(this).val();
                console.log("OFFER: " + name + " file " + filePath);
                //return $(this).val();

            });

        }
		*/

        //var fileInputDialogListener = setDialogListener('#fileInputDialog');
        //var fileSaveDialogListener = setDialogListener('#fileSaveDialog');

        /*
        $scope.inputDialogChange = function() {
            console.log("CHANGE FOUND");
            //var val = $('#' + peer.name + 'fileInputDialog').val();
            //console.log("VAL: " + val);
        };

        $scope.fileNameChanged = function(scopen) {
            console.log("select file " + scopen.name);
        };
        */

        $scope.clickAddButton = function(clickEvent) {

            console.log("Clicked Send Button!");
            console.log(clickEvent);

            //fileInputDialogListener.trigger('click');
            $('#fileInputDialog').trigger('click');
			//console.log("Clicked on " + '#' + peer.name + 'fileInputDialog');

        };

        $scope.clickDownloadButton = function(clickEvent, peer, file) {

            console.log("Clicked Download Button for " + file.name);
            //console.log(clickEvent);

            $('#' + peer.name + 'fileSaveDialog').trigger('click');
            console.log("Clicked on #" + peer.name + "fileSaveDialog");
        };

        PeerDiscoveryListener.start(function() {

            console.log("Started Peer Discovery Listener");

        });

        PeerDiscoveryBroadcaster.start(function() {

            console.log("Started Peer Discovery Broadcaster");

        });

        FileTransferServer.start(function() {

            console.log("Started File Transfer Server");

        });

        $scope.addFile  = function() {

            //console.log("OFFERING TO " + peer.name);
			var filename = $("#" + peer.name + "fileInputDialog").val();
			console.log("FILENAME VALUE IS " + filename);
            peer.socket.emit('file.download.offer', { filename : filename, peername : Peer.myPeer().name });

        };

        $scope.downloadFile  = function(peer, file) {

            console.log("DOWNLOADING FROM " + peer.name);
            var downloadLocation = $("#" + peer.name + "fileSaveDialog").val();
            console.log("FILENAME VALUE IS " + file.name + " and download location is " + downloadLocation);
            Peer.myPeer().downloadingFiles[file.name] = {
                filename: file.name,
                downloadLocation: downloadLocation
            };
            peer.socket.emit('file.download.request', { filename : file.name, peername : Peer.myPeer().name });

        }

    }])
    .directive('onChange', function() {

        return {

            restrict: 'A',
            scope:{'onChange':'&' },

            link: function(scope, elm) {

				elm.bind('change', function() {

					scope.onChange();

                });
            }

        };
    });