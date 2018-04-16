exports.SQL_QUERIES = {
    NEW_CONVERSATION_COUNT_QUERY: "SELECT  UNIT (created_at) AS UNIT ,count(1) AS count FROM conversations WHERE created_at BETWEEN DATE_FORMAT(:endDate , '%Y-%m-%d 00:00:00') AND NOW()  and agent_id in (:agentIds) GROUP BY UNIT ;",
    CLOSED_CONVERSATION_COUNT_QUERY: "SELECT UNIT (created_at) AS UNIT ,count(1) AS count FROM conversations WHERE status=:status and created_at BETWEEN DATE_FORMAT(:endDate , '%Y-%m-%d 00:00:00') AND NOW()  and agent_id in (:agentIds) GROUP BY UNIT ;",
    AVG_RESPONSE_TIME_QUERY: "select avg( TIMESTAMPDIFF (second, created_at, updated_at)) as average from conversations where created_at BETWEEN DATE_FORMAT(:endDate, '%Y-%m-%d 00:00:00') AND NOW() and agent_id in (:agentIds);",
    AVG_RESOLUTION_TIME_QUERY: "select avg( TIMESTAMPDIFF (second, created_at, close_at)) as average from conversations where created_at BETWEEN DATE_FORMAT(:endDate, '%Y-%m-%d 00:00:00') AND NOW() and agent_id in (:agentIds);"
}