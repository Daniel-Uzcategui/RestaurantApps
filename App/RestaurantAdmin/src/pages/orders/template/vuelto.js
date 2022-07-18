export const orderEmail = () => {
  // const { domain, icon, name, customerData } = logo ?? {}
  // console.log(customerData)
  return `
  <!DOCTYPE html>
  
  <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
  <title></title>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
    * {
      box-sizing: border-box;
    }
  
    body {
      margin: 0;
      padding: 0;
    }
  
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: inherit !important;
    }
  
    #MessageViewBody a {
      color: inherit;
      text-decoration: none;
    }
  
    p {
      line-height: inherit
    }
  
    @media (max-width:520px) {
      .row-content {
        width: 100% !important;
      }
  
      .image_block img.big {
        width: auto !important;
      }
  
      .stack .column {
        width: 100%;
        display: block;
      }
    }
  </style>
  </head>
  <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  

  </body>
  </html>
  `
}
