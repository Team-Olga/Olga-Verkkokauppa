function packingSlipHTML() {
  return `<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Supplier Packing Slip Email</title>
  <!-- basic structure and styling copied over from /private/email/templates/orders/new.html -->
  <style type="text/css">
    /* Media Query for mobile */

    @media screen and (max-width: 599px) {
      /* This resizes tables and images to be 100% wide with a proportionate width */
      table[class=emailwrapto100pc],
      td[class=emailwrapto100pc],
      img[class=emailwrapto100pc] {
        width: 100% !important;
        height: auto !important;
      }
      table[class=emailwrapto90pc],
      td[class=emailwrapto90pc],
      img[class=emailwrapto90pc] {
        width: 90% !important;
        height: auto !important;
        margin: 0 auto !important;
      }
      td[class=padding] {
        padding-left: 0 !important;
        padding-right: 0px !important;
      }
      td[class=nopadding] {
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 0 !important;
        padding-top: 0 !important;
      }
      td[class=textalignCenter] {
        text-align: center !important;
      }
      img[class=resize] {
        width: 90% !important;
        height: 50px !important;
      }
      img[class=resize100] {
        width: 100% !important;
        height: auto !important;
      }
      img[class=resize1001] {
        width: 100% !important;
        height: auto !important;
        padding: 10px 0 !important;
      }
      td[class=tabs] {
        padding-left: 0 !important;
        padding-right: 0 !important;
        text-align: center !important;
        width: 90% !important;
        float: left !important;
        margin: 0 5% !important;
      }
      td[class=tabsnopadd] {
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 0 !important;
        padding-top: 0 !important;
        text-align: center !important;
        width: 90% !important;
        float: left !important;
        margin: 0 5% !important;
      }
      td[class=tabs100pc] {
        padding-left: 0 !important;
        padding-right: 0 !important;
        text-align: center !important;
        width: 100% !important;
        float: left !important;
        margin: 0 0% !important;
      }
      td[class=invisible] {
        display: none !important;
      }
      td[class=noheight] {
        height: auto;
        padding-bottom: 20px;
      }
    }
    /* Additional Media Query for tablets */

    @media screen and (min-width: 620px) and (max-width: 1024px) {
      /* Same as above */
      /*table[class=emailwrapto100pc], img[class=emailwrapto100pc]{width:auto !important; max-width:738px; height:auto !important;}*/
      a[href^=tel] {
        color: inherit;
        text-decoration: none;
      }
      a img {
        border: 0;
        outline: 0;
      }
      img {
        border: 0;
        outline: 0;
      }
      .a5q {
        display: none !important;
      }
      table table table div {
        display: none !important;
      }
    }

  </style>
</head>

<body style="margin:0; padding:0;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">
    <tr>
      <td align="center" valign="middle">
        <table width="600" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">
          <tr>
            <td valign="top" align="left">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">
                <tr>
                  <td height="10" align="left" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
                <tr>
                  <td height="4" align="left" valign="top" bgcolor="#1999dd" style="font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
                <tr>
                  <td align="center" valign="top">
                    <table width="545" border="0" cellspacing="0" cellpadding="0" class="emailwrapto90pc">
                      <tr>
                        <td valign="top" align="left">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">

                            <!-- Begin Header -->
                            <tr>
                              <td height="34" align="left" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="left" valign="top">
                                <a href="#"><img src="{{emailLogo}}" width="49" height="49"
                                      alt="logo"></a>
                              </td>
                            </tr>
                            <tr>
                              <td height="31" align="left" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; line-height:22px; color:#1e98d5;">Lähetyslista</td>
                            </tr>
                            <!-- End Header -->

                            <!-- Begin Body -->
                            <tr>
                              <td align="left" valign="top">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">
                                  <tbody>
                                    
                                    <tr>
                                      <td valign="top" align="left" height="10" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="2" style="line-height:2px; font-size:2px; border-top:solid 2px #efefee;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="20" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>

                                    <tr>
                                      <td width="100%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica; font-weight:bold;">Toimittaja</td>
                                    </tr>

                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="2" style="line-height:1px; font-size:1px; border-top:solid 2px #efefee;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="13" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>

                                    <tr>
                                      <td align="left" valign="top">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">
                                          <tbody>
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Tunnus</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{supplier._id}}</td>
                                            </tr>
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Nimi</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{supplier.name}}</td>
                                            </tr>                                            
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Osoite</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{supplier.address.address}}</td>
                                            </tr>
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;"></td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{supplier.address.postal}} {{supplier.address.city}}</td>
                                            </tr>
                                          </tbody>
                                        </table>  
                                      </td>
                                    </tr>

                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td width="100%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica; font-weight:bold;">Lähetyksen sisältö</td>
                                    </tr>

                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="2" style="line-height:1px; font-size:1px; border-top:solid 2px #efefee;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="13" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>

                                    <tr>
                                      <td align="left" valign="top">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">
                                          <tbody>
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Tuotteen tunnus</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{product._id}}</td>
                                            </tr>
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Tuotteen nimi</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{product.title}}</td>
                                            </tr>                                            
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Tuotteen määrä</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{deliveryQuantity}}</td>
                                            </tr>
                                          </tbody>
                                        </table>  
                                      </td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td width="100%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica; font-weight:bold;">Toimitussopimukset</td>
                                    </tr>

                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="2" style="line-height:1px; font-size:1px; border-top:solid 2px #efefee;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="13" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>

                                    {{#each supplyContracts}}
                                    <tr>
                                      <td valign="top" align="left">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="emailwrapto100pc">
                                          <tbody>
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Sopimuksen tunnus</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{_id}}</td>
                                            </tr>
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">Sopimuksesta toimittamatta</td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;">{{remainingQuantity}}</td>
                                            </tr>                                            
                                            <tr>
                                              <td width="33%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;"></td>
                                              <td width="67%" align="left" valign="top" style="font-size:14px; line-height:normal; color:#4c4c4d; font-family:Arial, helvetica;"></td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td valign="top" align="left" height="15" style="line-height:1px; font-size:1px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td valign="top" align="left" height="2" style="line-height:1px; font-size:1px; border-top:solid 2px #efefee;">&nbsp;</td>
                                    </tr>
																		{{/each}}
                                    
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <!-- End Body -->

                            <!-- Begin footer -->
                            <tr>
                              <td height="32" align="left" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td height="1" align="left" valign="middle" bgcolor="#e2e2e2" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td height="15" align="left" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:normal; line-height:17px;">You received this email because you notified {{shopName}} of a product delivery. Questions or suggestions? Email us at <a href="mailto:{{contactEmail}}" style="text-decoration:none; color:#1e98d5;">{{contactEmail}}</a></td>
                            </tr>
                            <!-- Social Icons section removed -->
                            <tr>
                              <td height="3" align="left" valign="top" bgcolor="#1f97d4" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td height="18" align="left" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:normal; line-height:12px; color:#4d4c4d;">&copy; {{copyrightDate}} {{legalName}}. All rights reserved</td>
                            </tr>
                            <tr>
                              <td height="8" align="left" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td align="left" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:normal; line-height:10px; color:#787878;">{{physicalAddress.address}}, {{physicalAddress.postal}} {{physicalAddress.city}}</td>
                            </tr>
                            <!-- End footer -->

                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>`;
}

export default packingSlipHTML;