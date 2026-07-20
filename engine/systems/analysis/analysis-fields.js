/* Billy Labs Analysis Field Registry v3.1.2
   Stable IDs are authoritative. Display names may change without migrating specimen records. */
(function(global){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const fields=[
    {id:'field_primary_subject',displayName:'Primary Subject',groupId:'group_subject',type:'text',cardinality:'single',status:'active'},
    {id:'field_color_dominant_general',displayName:'Dominant Color',groupId:'group_appearance',type:'controlled_option',cardinality:'single',optionSetId:'options_color_general_canonical',status:'active'},
    {id:'field_color_dominant_brightness',displayName:'Dominant Color Brightness',groupId:'group_appearance',type:'controlled_option',cardinality:'single',optionSetId:'options_color_brightness_v1',status:'active'},
    {id:'field_original_ingredients',displayName:'Original Ingredients',groupId:'group_identity',type:'canonical_ingredient_pair',cardinality:'single',status:'system'},
    {id:'field_release_batch',displayName:'Release Batch',groupId:'group_identity',type:'text',cardinality:'single',status:'system'}
  ];
  const optionSets={
    options_color_brightness_v1:{id:'options_color_brightness_v1',displayName:'Dominant Color Brightness',options:[
      {id:'color_brightness_light',displayName:'Light'},{id:'color_brightness_medium',displayName:'Medium'},
      {id:'color_brightness_dark',displayName:'Dark'},{id:'color_brightness_mixed',displayName:'Mixed'}]},
    options_color_general_canonical:{id:'options_color_general_canonical',displayName:'Canonical General Colors',options:[
      {id:'color_red',displayName:'Red'},{id:'color_orange',displayName:'Orange'},{id:'color_yellow',displayName:'Yellow'},
      {id:'color_green',displayName:'Green'},{id:'color_blue',displayName:'Blue'},{id:'color_purple',displayName:'Purple'},
      {id:'color_cyan',displayName:'Cyan'},{id:'color_pink',displayName:'Pink'},{id:'color_gray',displayName:'Gray'},
      {id:'color_black',displayName:'Black'},{id:'color_white',displayName:'White'},{id:'color_brown',displayName:'Brown'},
      {id:'color_teal',displayName:'Teal'},{id:'color_magenta',displayName:'Magenta'},{id:'color_beige_tan',displayName:'Beige/Tan'},
      {id:'color_multicolor',displayName:'Multicolor'}
    ],note:'Multicolor is used only when no single color dominates. Gold maps to Yellow; silver maps to Gray. Chromatic colors win ties over neutrals.'}
  };
  const byId=id=>fields.find(field=>field.id===id)||null;
  const optionById=id=>Object.values(optionSets).flatMap(set=>set.options).find(option=>option.id===id)||null;
  global.BillyAnalysisFields={list:()=>clone(fields),get:id=>clone(byId(id)),optionSets:()=>clone(optionSets),option:id=>clone(optionById(id))};
})(window);
