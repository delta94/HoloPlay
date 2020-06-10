// @flow
import React, { useState } from 'react';
import { withApollo } from 'react-apollo';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Card from '../Layout';
import { actions } from '../../../store';
import Spacer from '../../Spacer';
import { CarouselPlayIcon } from '../../Carousel';
import Source from '../../Source';
import DialogRemovePlaylist from '../../Dialog/RemovePlaylist';
import MenuPlaylist from '../../Menu/Playlist';
import {
  REMOVE_PLAYLIST,
  REMOVE_SOURCE_TO_PLAYLIST
} from '../../../graphql/mutation/playlist';
import GET_USER from '../../../graphql/query/user';
import useStore from '../../../hooks/useStore';

type CardPlaylistProps = {
  client?: Object,
  totalSongs: number,
  playlist: Object,
  toggleModal: Function,
  card: Object,
  userId: number
};

const CardPlaylist = ({
  client,
  totalSongs,
  playlist,
  toggleModal,
  ...props
}) => {
  const store = useStore();
  const [dialogIsOpen, setToggleDialog] = useState(false);
  const [showItems, setToggleItems] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDialog = () => setToggleDialog(!dialogIsOpen);
  const toggleItems = () => setToggleItems(!showItems);

  const refetchQueries = [
    {
      query: GET_USER,
      variables: {
        userId: props.userId
      }
    }
  ];

  const removePlaylist = async () => {
    setIsLoading(true);

    try {
      await fetch(
        `${store.instance}/api/v1/auth/playlists/${playlist.playlistId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${store.token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }

    actions.setFlashMessage(`${playlist.title} has been removed.`);
    toggleDialog();
    setIsLoading(false);
  };

  const removeSource = async indexId => {
    try {
      await fetch(
        `${store.instance}/api/v1/auth/playlists/${
          playlist.playlistId
        }/videos/${indexId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${store.token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }

    actions.removeFromPlaylist({
      playlistId: playlist.playlistId,
      indexId: indexId
    });

    return actions.setFlashMessage(`${indexId} has been removed.`);
  };

  return (
    <>
      <Card
        {...props}
        items={playlist.videos}
        itemsRenderer={
          <Source
            items={playlist.videos}
            onPlay={async sourceIndex => {
              if (sourceIndex) {
                await actions.setPlaylistFrom(playlist.videos);
                await actions.loadSource(sourceIndex);
                return actions.showPlayer();
              }
            }}
            onRemove={removeSource}
            playlistId={playlist.playlistId}
          />
        }
        showItems={showItems}
        playlistId={playlist.playlistId}
        onPress={playlist.videos.length === 0 ? null : toggleItems}
        rightContent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginRight: -30
            }}>
            {playlist.videos > 0 && (
              <CarouselPlayIcon
                onPress={async () => {
                  await actions.setPlaylistFrom(playlist.videos);
                  actions.loadSource(0);
                }}
              />
            )}
            <MenuPlaylist
              onEdit={() => toggleModal(playlist)}
              onRemove={toggleDialog}
            />
          </View>
        }>
        <Text>
          {totalSongs} song{totalSongs > 1 && 's'}
        </Text>
      </Card>
      <Spacer height={10} />
      {/* TODO: Maybe remove this Dialog and import to screen parent ? */}
      <DialogRemovePlaylist
        visible={dialogIsOpen}
        toggleDialog={toggleDialog}
        onPress={removePlaylist}
        playlistName={playlist.title}
        loading={isLoading}
      />
    </>
  );
};

export default withApollo<CardPlaylistProps>(CardPlaylist);
