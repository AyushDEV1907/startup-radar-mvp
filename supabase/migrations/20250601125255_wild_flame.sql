/*
  # Fix vertical recommendations score type

  1. Changes
    - Modify get_vertical_recommendations function to return score as numeric instead of bigint
    - This ensures compatibility with TypeScript/JavaScript number type
    - Preserves decimal precision for score calculations

  2. Technical Details
    - Changes RETURNS TABLE definition to use numeric for score column
    - Casts any existing bigint calculations to numeric
    - Maintains same function signature and parameters
*/

CREATE OR REPLACE FUNCTION get_vertical_recommendations(user_id_input text)
RETURNS TABLE (
  id text,
  name text,
  industry text,
  stage text,
  score numeric
)
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  RETURN QUERY
  WITH user_interactions AS (
    SELECT 
      startup_id,
      COUNT(*) as interaction_count
    FROM interactions
    WHERE investor_id = user_id_input
    GROUP BY startup_id
  )
  SELECT 
    s.id::text,
    s.name,
    s.industry,
    s.stage,
    COALESCE(ui.interaction_count::numeric / 
      (SELECT NULLIF(MAX(interaction_count), 0)::numeric 
       FROM user_interactions), 0.0) as score
  FROM startups s
  LEFT JOIN user_interactions ui ON s.id = ui.startup_id
  ORDER BY score DESC, s.created_at DESC
  LIMIT 10;
END;
$$;