
// -----------------------------------------------------------
// 
// CONTENT
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
    "content",
    _val.init()
      .set("uid", "f110a9d1-c9cd-40a3-9359-7b472234e0ac")
      .set("page_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("type_id", "5d68fe7f-bfc9-424b-98bc-50c0bfe96f2f")
      .set("image", "")
      .set("image_title", "")
      .set("image_alt", "")
      .set("image_max_width", 0)
      .set("title", "Documenta\u00E7\u00E3o")
      .set("content", "<p>Veja a documenta\u00E7\u00E3o oficial online em:</p><ul><li><a href=\"https://github.com/netuno-org/cluar/blob/main/docs/README-pt_PT.md\" target=\"_blank\">Documenta\u00E7\u00E3o Oficial no GitHub</a></li></ul><p>A vers\u00E3o offline est\u00E1 na pasta <b>docs</b> que est\u00E1 na ra\u00EDz deste projeto, a\u00ED \u00E9 onde vai encontrar o README inicial.</p>")
      .set("sorter", 20)
  );
  
  _db.insertIfNotExists(
    "content",
    _val.init()
      .set("uid", "ed312fe0-b839-4367-82c1-1445464b39d0")
      .set("page_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
      .set("type_id", "5d68fe7f-bfc9-424b-98bc-50c0bfe96f2f")
      .set("image", "")
      .set("image_title", "")
      .set("image_alt", "")
      .set("image_max_width", 0)
      .set("title", "C\u00F3digo Aberto & Comunidade")
      .set("content", "<p>Todas as tecnologias utilizadas aqui s\u00E3o livres e abertas.</p><p>Colabore sugerindo melhorias ou reportando problemas em&nbsp;<a href=\"https://github.com/netuno-org/cluar/issues\" target=\"_blank\">issues</a>.</p><p>Para ajudar a comunidade publique as tuas d\u00FAvidas e dificuldades no <a href=\"https://forum.netuno.org/\" target=\"_blank\">forum</a>.&nbsp;<br></p><p>Visite o site do <a href=\"https://www.netuno.org/\" target=\"_blank\">Netuno</a>&nbsp;e siga-nos nas redes sociais e participe do nosso servidor no discord, os links est\u00E3o no rodap\u00E9.</p>")
      .set("sorter", 30)
  );
  
  _db.insertIfNotExists(
    "content",
    _val.init()
      .set("uid", "b0697f9e-3eb0-468f-bb71-13d5a9e211fe")
      .set("page_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("type_id", "5d68fe7f-bfc9-424b-98bc-50c0bfe96f2f")
      .set("image", "")
      .set("image_title", "")
      .set("image_alt", "")
      .set("image_max_width", 0)
      .set("title", "Documentation")
      .set("content", "<p>See the official documentation online at:</p><ul><li><a href=\"https://github.com/netuno-org/cluar/blob/main/docs/README.md\" target=\"_blank\">Official Documentation on GitHub</a></li></ul><p>The offline version is in the <b>docs</b> folder at the root of this project, that's where you'll find the initial README.</p>")
      .set("sorter", 20)
  );
  
  _db.insertIfNotExists(
    "content",
    _val.init()
      .set("uid", "d7564744-f70f-4859-9070-86a3b2a83e91")
      .set("page_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
      .set("type_id", "5d68fe7f-bfc9-424b-98bc-50c0bfe96f2f")
      .set("image", "")
      .set("image_title", "")
      .set("image_alt", "")
      .set("image_max_width", 0)
      .set("title", "Open Source & Community")
      .set("content", "<p>All technologies used here are free and open.</p><p>Collaborate by suggesting improvements or reporting problems in <a href=\"https://github.com/netuno-org/cluar/issues\" target=\"_blank\">issues</a>.</p><p>To help the community post your doubts and difficulties in the <a href=\"https://forum.netuno.org/\" target=\"_blank\">forum</a>.&nbsp;<br></p><p>Visit <a href=\"https://www.netuno.org/\" target=\"_blank\">Netuno</a>'s website and follow us on social media and join our discord server, the links are in the footer.</span></p>")
      .set("sorter", 30)
  );
}
