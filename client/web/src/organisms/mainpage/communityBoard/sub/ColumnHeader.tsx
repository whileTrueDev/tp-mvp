import { ListItem, Typography, useTheme } from "@material-ui/core";
import React from "react";

function ColumnHeader({ columns }: {
  columns: Record<string, any>[]
 }) {
   const theme = useTheme();
   return (
     <ListItem
       component="div"
       style={{
         display: 'flex',
         backgroundColor: theme.palette.primary.main,
       }}
     >
       {columns.map((col) => (
         <Typography
           style={{
             width: col.width,
             textAlign: 'center',
             color: theme.palette.primary.contrastText,
           }}
           key={col.key}
         >
           {col.title}
         </Typography>
       ))}
     </ListItem>
   );
 }

 export default ColumnHeader;