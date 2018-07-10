<template>
  <div class="main-footer mt-5">
    <v-container grid-list-md>
      <v-layout row wrap justify-space-between>
        <v-flex xs12 class="footer-sep mt-3">
          <v-icon >message</v-icon> CONTACT
        </v-flex>
        <v-flex xs12 sm2 md1 class="mr-4">
          <a href="https://www.oeaw.ac.at/acdh/acdh-home/" target="_blank" rel="noopener" aria-label="ACDH">
            <img src="/static/acdh_logo.png" alt="ACDH" title="Austrian Center for Digital Humanities">
          </a>
        </v-flex>
        <v-flex xs12 sm3>
            <p>
              ACDH-ÖAW
              <br>
              Austrian Centre for Digital Humanities
              <br>
              Austrian Academy of Sciences
            </p>
            <p>
              Sonnenfelsgasse 19,
              <br>
              1010 Vienna
            </p>
            <p>
              T: +43 1 51581-2200
              <br>
              E: <a href="javascript:linkTo_UnCryptMailto('nbjmup;bdeiApfbx/bd/bu');">acdh(at)oeaw.ac.at</a>
            </p>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs12 sm3>
          <h3>HELPDESK</h3>
          <p>ACDH runs a helpdesk offering advice for questions related to various digital humanities topics.</p>
          <p><a class="helpdesk-button" href="javascript:linkTo_UnCryptMailto('nbjmup;bdeiApfbx/bd/bu');">ASK US!</a></p>
        </v-flex>
      </v-layout>
    </v-container>
    <div class="footer-imprint-bar">
      © Copyright OEAW | <a href="https://arche.acdh.oeaw.ac.at/browser/imprint">Impressum/Imprint</a>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
      };
    },
    name: 'FundamentFooter',
  };
</script>
<style media="screen">
/* ARCHE COPY STYLES, TO BE IMPLEMENTED */
.main-footer {
  background-color: #FFFFFF;
}

.footer-sep {
  border-bottom: 1px solid #333333;
  padding-bottom: 15px;
  padding-top: 5px;
  margin-bottom: 35px;
  font-weight: 600;
  font-size: 14px;
}

.helpdesk-button {
  display: block;
  background-color: #FFFFFF;
  border: 1px solid #80cbc4!important;
  border-radius: 20px;
  padding: 5px 20px;
  font-size: 11px;
  font-weight: 600;
  color: #80cbc4;
  transition: background-color ease .2s, color ease .2s;
}

.helpdesk-button:hover, .helpdesk-button:focus {
  background-color: #80cbc4!important;
  color: #FFFFFF;
  transition: background-color ease .2s, color ease .2s;
}
footer .bodytext {
  font-size: 15px; }

.csc-textpic-text {
  padding-left: 20px; }

footer h3 {
  font-size: 17px; }

.footer-login-button {
  float: right;
  margin-left: 8px; }

.footer-login-button i {
  color: $acdh_blue;
  font-size: 22px;
  margin-top: 6px;
  transition: color ease .2s; }

.footer-login-button i:hover, .footer-login-button i:focus {
  color: #3B89AD; }

.footer-imprint-bar {
  text-align: center;
  background-color: #F1F1F1;
  padding: 8px;
  font-size: 14px; }
</style>
