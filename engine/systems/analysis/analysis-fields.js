/* Billy Labs Analysis Field Registry v3.1.1
   Stable IDs are authoritative. Display names may change without migrating specimen records. */
(function(global){
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const fields=[
    {
      id:'field_primary_subject',
      displayName:'Primary Subject',
      groupId:'group_subject',
      type:'text',
      cardinality:'single',
      status:'active'
    },
    {
      id:'field_color_dominant_general',
      displayName:'Dominant Color',
      groupId:'group_appearance',
      type:'controlled_option',
      cardinality:'single',
      optionSetId:'options_color_general_canonical',
      status:'active',
      note:'The canonical general-color set is maintained separately. Display labels may change; stored records reference permanent option IDs.'
    },
    {
      id:'field_color_dominant_brightness',
      displayName:'Dominant Color Brightness',
      groupId:'group_appearance',
      type:'controlled_option',
      cardinality:'single',
      optionSetId:'options_color_brightness_v1',
      status:'active'
    },
    {
      id:'field_original_ingredients',
      displayName:'Original Ingredients',
      groupId:'group_identity',
      type:'canonical_ingredient_pair',
      cardinality:'single',
      status:'system'
    },
    {
      id:'field_release_batch',
      displayName:'Release Batch',
      groupId:'group_identity',
      type:'text',
      cardinality:'single',
      status:'system'
    }
  ];
  const optionSets={
    options_color_brightness_v1:{
      id:'options_color_brightness_v1',
      displayName:'Dominant Color Brightness',
      options:[
        {id:'color_brightness_light',displayName:'Light'},
        {id:'color_brightness_medium',displayName:'Medium'},
        {id:'color_brightness_dark',displayName:'Dark'},
        {id:'color_brightness_mixed',displayName:'Mixed'}
      ]
    },
    options_color_general_canonical:{
      id:'options_color_general_canonical',
      displayName:'Canonical General Colors',
      options:[],
      note:'The already-approved 15 general colors belong here. They are intentionally not reconstructed from memory in this release.'
    }
  };
  const byId=id=>fields.find(field=>field.id===id)||null;
  const optionById=id=>Object.values(optionSets).flatMap(set=>set.options).find(option=>option.id===id)||null;
  global.BillyAnalysisFields={
    list:()=>clone(fields),
    get:id=>clone(byId(id)),
    optionSets:()=>clone(optionSets),
    option:id=>clone(optionById(id))
  };
})(window);
