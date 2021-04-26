import React, { forwardRef } from "react";
import clsx from "clsx";
import MaterialTable, { MTableToolbar } from "../otherComponents/material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import Save from "@material-ui/icons/Save";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  toolbar:{
paddingLeft:0
  },
  addBoxIcon: {
    fill: "#66c047",
    [theme.breakpoints.up("sm")]: {
      fontSize: 40,
    },
  },
  saveIcon: {
    [theme.breakpoints.up("sm")]: {
      fontSize: 40,
    },
  },
  fillWhite:{
    color:"white"
  },
  titleSpan: {
    color: "Black",
    fontSize: 30,
    background: "#2e3e4e",
    color: "white",
    padding:"5px 45px 5px 45px",
    
    display: "block",
  },
}));
const actionCellStyle = {
  backgroundColor: "#66c047",
  borderRight: "solid",
  borderRightWidth: 0.5,
  borderRightColor: "#66c047",
};
const selectedRowBackgroundColor = "#2e3e4e36";
const rowBackgroundColor = "white";
const altRowBackgroundColor = "rgb(230 227 227)";
const rowStyle = { padding: 0 };
const cellStyle = {
  paddingTop: 0,
  paddingBottom: 0,
  border: "solid",
  borderWidth: 0.5,
  borderColor: "#d8d6d6",
};
const headerStyle = {
  paddingTop: 8,
  paddingBottom: 8,
  fontWeight: "bolder",
  backgroundColor: "rgb(175, 168, 168)",
  borderRight: "solid",
  borderRightWidth: 0.5,
  borderRightColor: "rgb(206, 205, 205)",
  
};
export const SimpleDataGrid = (props) => {
  const classes = useStyles();
  const tableIcons = {
    Add: forwardRef((props, ref) => (
      <AddBox className={classes.addBoxIcon} {...props} ref={ref} />
    )),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => (
      <Delete className={classes.fillWhite} {...props} ref={ref} />
    )),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => (
      <Edit className={classes.fillWhite} {...props} ref={ref} />
    )),
    Export: forwardRef((props, ref) => (
      <Save className={classes.saveIcon} {...props} ref={ref} />
    )),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };
  const [selectedRow, setSelectedRow] = React.useState(null);
  return (

    <MaterialTable
      icons={tableIcons}
    
      onRowClick={(evt, selectedRow) =>
        setSelectedRow(selectedRow.tableData.id)
      }
      editable={{
       
        isDeleteHidden: props.isDeleteHidden,
        onRowDelete: props.onRowDelete,
        onRowUpdate: props.onRowUpdateInline,
      }}
      localization={{
        header: {
          actions: "",
        },
        body: {
          editTooltip: props.editTooltip,
          deleteTooltip: props.deleteTooltip,
          addTooltip: props.addTooltip,
          editRow: {
            deleteText: props.deleteText,
          },
        },
      }}
      actions={[
        props.onActionAddClick ? {
          icon: tableIcons.Add,
          tooltip: props.addTooltip,
          isFreeAction: true,
          onClick: props.onActionAddClick,
        } : null,
        !props.inlineEdit && !props.notAllowEdit 
          ? {
              icon: tableIcons.Edit,
              tooltip: props.editTooltip,
              onClick: props.onActionEditClick,
            
            }
          : null,
      ]}
      
      options={{
        exportFileName: props.exportFileName,
        search: true,
        exportButton: true,

        actionsCellStyle: actionCellStyle,
        rowStyle: (rowData, i) => ({
          backgroundColor:
            selectedRow === rowData.tableData.id
              ? selectedRowBackgroundColor
              : i % 2
              ? rowBackgroundColor
              : altRowBackgroundColor,
          ...rowStyle,
        }),
        cellStyle: cellStyle,
        headerStyle: headerStyle,
      }}
      title={<span className={classes.titleSpan}>{props.title}</span>}
      columns={props.columns}
      components={{
        Toolbar: props => (
          <div>
            <MTableToolbar  {...props} classes={{
              root:classes.toolbar
            }}/>
           
          </div>
        )
      }}
      data={props.data}
    />

  );
};
