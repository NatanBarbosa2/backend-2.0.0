export interface UserImageTypes {
  data: {
    clientName: string
    fieldName: string
    headers: {
      'content-type': string
      'content-disposition': string
    }
  }
  clientName: string
  extname: string
  move: Function
  moveToDisk: Function
}
