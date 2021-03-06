export const ApiRoutes = {
  VideoId: (videoId: string) => `videos/${videoId}`,
  Preferences: 'auth/preferences',
  Playlists: 'auth/playlists',
  PlaylistId: (playlistId: string) => `auth/playlists/${playlistId}`,
  Videos: (playlistId: string) => `auth/playlists/${playlistId}/videos`,
  VideoIndexId: (playlistId: string, indexId: string) =>
    `auth/playlists/${playlistId}/videos/${indexId}`
};

export const FAVORIS_PLAYLIST_TITLE: string = 'favoris';
