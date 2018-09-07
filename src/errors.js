export default (err) => {
  if (err.response) {
    switch (err.response.status) {
      case 403:
        return `Code: ${err.response.status} Access Denied. ${err.response.config.url}`;
      case 404:
        return `Code: ${err.response.status} Resourse Not Found. ${err.response.config.url}`;
      case 429:
        return `Code: ${err.response.status} Too Many Requests. ${err.response.config.url}`;
      case 500:
        return `Code: ${err.response.status} Internal Server Error. ${err.response.config.url}`;
      case 503:
        return `Code: ${err.response.status} Server Unavailable. ${err.response.config.url}`;
      default:
        return `Unknown code: ${err.response.code}`;
    }
  } else {
    switch (err.code) {
      case 'EACCES':
        return 'Permission denied for directory';
      case 'ECONNREFUSED':
        return `No connection for ${err.config.url} url`;
      case 'ENOTFOUND':
        return `Wrong url address: ${err.config.url}.`;
      case 'EEXIST':
        return `File/directory: '${err.path}' already exists.`;
      case 'ENOTDIR':
        return `Is not a directory: ${err.path}`;
      case 'EISDIR':
        return 'Path is directory\n';
      case 'ENOENT':
        return `No such file/directory: ${err.path}`;
      default:
        return `Error code: ${err.code}`;
    }
  }
};
