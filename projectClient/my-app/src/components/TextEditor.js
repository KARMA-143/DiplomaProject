import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import {Badge, Box, ButtonGroup, IconButton, Menu, MenuItem, SvgIcon, Typography} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import {useEffect, useRef, useState} from "react";
import Tooltip from "@mui/material/Tooltip";
import {
    FormatBold as BoldIcon,
    FormatItalic as ItalicIcon,
    FormatStrikethrough as StrikeIcon,
    Code as CodeIcon,
    FormatQuote as QuoteIcon,
    HorizontalRule as HrIcon,
    Undo as UndoIcon,
    Redo as RedoIcon,
    FormatListBulleted as BulletListIcon,
    FormatListNumbered as OrderedListIcon, ArrowUpward, ArrowDownward, ArrowBack, ArrowForward,
} from '@mui/icons-material';
import "../styles/TextEditor.css";
import TableChartIcon from '@mui/icons-material/TableChart'
import MergeIcon from '@mui/icons-material/Merge';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import AddIcon from "@mui/icons-material/Add";
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import FormatClearIcon from '@mui/icons-material/FormatClear';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from '@mui/icons-material/List';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TextAlign from '@tiptap/extension-text-align'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FontFamily from '@tiptap/extension-font-family'
import { Color } from '@tiptap/extension-color'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import { SketchPicker } from 'react-color'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import HighlightIcon from '@mui/icons-material/Highlight';
import Highlight from '@tiptap/extension-highlight'
import ImageResize from 'tiptap-extension-resize-image';
import DataObjectIcon from '@mui/icons-material/DataObject';
import Placeholder from '@tiptap/extension-placeholder'

const SimpleMenuBar = ({ editor }) => {
    if (!editor) return null;

    return (
        <ButtonGroup variant="outlined" size="small">
        <Tooltip title="Bold">
            <Box component={"span"}>
                <IconButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().toggleBold()}
                    color={editor.isActive('bold') ? 'primary' : 'default'}>
                    <BoldIcon />
                </IconButton>
            </Box>
        </Tooltip>
        <Tooltip title="Italic">
            <Box component={"span"}>
                <IconButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().toggleItalic()}
                    color={editor.isActive('italic') ? 'primary' : 'default'}>
                    <ItalicIcon />
                </IconButton>
            </Box>
        </Tooltip>
        <Tooltip title="Strikethrough">
            <Box component={"span"}>
                <IconButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().toggleStrike()}
                    color={editor.isActive('strike') ? 'primary' : 'default'}>
                    <StrikeIcon />
                </IconButton>
            </Box>
        </Tooltip>
        <Tooltip title="Underline">
            <Box component={"span"}>
                <IconButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={!editor.can().toggleUnderline()}
                    color={editor.isActive('underline') ? 'primary' : 'default'}>
                    <FormatUnderlinedIcon />
                </IconButton>
            </Box>
        </Tooltip>
        <Tooltip title="Subscript">
            <Box component={"span"}>
                <IconButton
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    disabled={!editor.can().toggleSubscript()}
                    color={editor.isActive('subscript') ? 'primary' : 'default'}>
                    <SubscriptIcon />
                </IconButton>
            </Box>
        </Tooltip>
        <Tooltip title="Superscript">
            <Box component={"span"}>
                <IconButton
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    disabled={!editor.can().toggleSuperscript()}
                    color={editor.isActive('superscript') ? 'primary' : 'default'}>
                    <SuperscriptIcon />
                </IconButton>
            </Box>
        </Tooltip>
        <Tooltip title={"Add link"}>
            <Box component={"span"}>
                <IconButton
                    onClick={() => editor.chain().focus().setLink({ href: prompt('Enter the URL') }).run()}
                    color={editor.isActive('link') ? 'primary' : 'default'}
                    disabled={!editor.can().setLink({href: ""})}
                >
                    <LinkIcon />
                </IconButton>
            </Box>
        </Tooltip>
        <AddListDropDownMenu editor={editor}/>
    </ButtonGroup>
    );
};

const AlterTableDropDownMenu=({editor})=>{
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isMenuDisabled = !(
        editor?.can().addRowBefore() ||
        editor?.can().addRowAfter() ||
        editor?.can().deleteRow() ||
        editor?.can().addColumnBefore() ||
        editor?.can().addColumnAfter() ||
        editor?.can().deleteColumn() ||
        editor?.can().deleteTable()
    );

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <Tooltip title={"Alter table"}>
                <Box component={"span"}>
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleOpen}
                        disabled={isMenuDisabled}
                    >
                    <Badge
                        badgeContent={<EditIcon fontSize={"small"} color={"primary"} sx={{background:"white", borderRadius:"50%"}}/>}
                        color="default"
                        overlap="circular"

                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <TableChartIcon/>
                    </Badge>
                </IconButton>
                </Box>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    disablePadding: true
                }}
            >
                <Tooltip title="Add row before">
                    <MenuItem
                    sx={{padding:0, margin: 0}}
                    onClick={() => {
                        editor.chain().focus().addRowBefore().run();
                        handleClose();
                    }}
                    disabled={!editor.can().addRowBefore()}
                >
                    <IconButton>
                        <Badge
                            badgeContent={<ArrowUpward fontSize={"small"} color={"primary"} />}
                            color="default"
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <AddIcon />
                        </Badge>
                    </IconButton>
                </MenuItem>
                </Tooltip>
                <Tooltip title="Add row after">
                    <MenuItem
                        sx={{padding:0, margin: 0}}
                        onClick={() => {
                            editor.chain().focus().addRowAfter().run();
                            handleClose();
                        }}
                        disabled={!editor.can().addRowAfter()}
                    >
                        <IconButton>
                        <Badge
                            badgeContent={<ArrowDownward fontSize={"small"} color={"primary"} />}
                            color="default"
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <AddIcon />
                        </Badge>
                    </IconButton>
                    </MenuItem>
                </Tooltip>
                <Tooltip title="Delete row">
                    <MenuItem
                        sx={{padding:0, margin: 0}}
                        onClick={() => {
                            editor.chain().focus().deleteRow().run();
                            handleClose();
                        }}
                        disabled={!editor.can().deleteRow()}
                    >
                            <Badge
                                badgeContent={<CloseIcon fontSize={"small"} color={"error"} />}
                                color="default"
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <IconButton>
                                    <TableRowsIcon/>
                                </IconButton>
                            </Badge>
                    </MenuItem>
                </Tooltip>
                <Tooltip title="Add column before">
                    <MenuItem
                        sx={{padding:0, margin: 0}}
                        onClick={() => {
                            editor.chain().focus().addColumnBefore().run();
                            handleClose();
                        }}
                        disabled={!editor.can().addColumnBefore()}
                    >
                        <IconButton>
                            <Badge
                                badgeContent={<ArrowBack fontSize={"small"} color={"primary"} />}
                                color="default"
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                <AddIcon />
                            </Badge>
                        </IconButton>
                    </MenuItem>
                </Tooltip>
                <Tooltip title="Add column after">
                    <MenuItem
                        sx={{padding:0, margin: 0}}
                        onClick={() => {
                            editor.chain().focus().addColumnAfter().run();
                            handleClose();
                        }}
                        disabled={!editor.can().addColumnAfter()}
                    >
                        <IconButton>
                            <Badge
                                badgeContent={<ArrowForward fontSize={"small"} color={"primary"} />}
                                color="default"
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <AddIcon />
                            </Badge>
                        </IconButton>
                    </MenuItem>
                </Tooltip>
                <Tooltip title="Delete column">
                    <MenuItem
                        sx={{margin:0, padding: 0}}
                        onClick={() => {
                            editor.chain().focus().deleteColumn().run();
                            handleClose();
                        }}
                        disabled={!editor.can().deleteColumn()}
                    >
                        <Badge
                            badgeContent={<CloseIcon fontSize={"small"} color={"error"} />}
                            color="default"
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <IconButton>
                                <ViewColumnIcon />
                            </IconButton>
                        </Badge>
                    </MenuItem>
                </Tooltip>
                <Tooltip title="Delete Table">
                    <MenuItem
                        sx={{margin:0, padding: 0}}
                        onClick={() => {
                            editor.chain().focus().deleteTable().run();
                            handleClose();
                        }}
                        disabled={!editor.can().deleteTable()}
                    >
                        <Badge
                            badgeContent={<CloseIcon fontSize={"small"} color={"error"} />}
                            color="default"
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <IconButton>
                                <TableChartIcon />
                            </IconButton>
                        </Badge>
                    </MenuItem>
                </Tooltip>
            </Menu>
        </div>
    );
}

const ColorPickerButton = ({
                               editor,
                               icon,
                               getCurrentColor,
                               applyColor,
                               disabled,
                               title
                           }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const pickerRef = useRef(null);

    const currentColor = getCurrentColor(editor) || '#000000';

    const handleColorChange = (color) => {
        applyColor(editor, color.hex);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        };

        if (showColorPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showColorPicker]);

    return (
        <>
            <Tooltip title={title}>
                <IconButton
                    onClick={() => setShowColorPicker((prev) => !prev)}
                    disabled={disabled}
                >
                    <Badge
                        badgeContent={<Box sx={{background: currentColor, width:"10px", height:"10px", border:"1px solid #000", borderRadius:"50%"}}></Box>}
                        color="default"
                        overlap="circular"
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    >
                        {icon}
                    </Badge>
                </IconButton>
            </Tooltip>
            {showColorPicker && (
                <div
                    className="color-picker"
                    ref={pickerRef}
                    style={{
                        position: 'absolute',
                        zIndex: 10,
                    }}
                >
                    <SketchPicker color={currentColor} onChange={handleColorChange} />
                </div>
            )}
        </>
    );
};

const SetFontDropDownMenu=({editor})=>{
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isMenuDisabled=!editor.can().setFontFamily();

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fonts = [
        { name: 'None', css: null },
        { name: 'Arial', css: 'Arial, sans-serif' },
        { name: 'Times New Roman', css: '"Times New Roman", serif' },
        { name: 'Georgia', css: 'Georgia, serif' },
        { name: 'Comic Sans', css: '"Comic Sans MS", "Comic Sans", cursive' },
        { name: 'Courier New', css: '"Courier New", monospace' },
        { name: 'Roboto', css: '"Roboto", sans-serif' },
        { name: 'Inter', css: '"Inter", sans-serif' },
        { name: 'JetBrains Mono', css: '"JetBrains Mono", monospace' }
    ];

    return(
        <div>
            <Tooltip title={"Set font"}>
                <Box component={"span"}>
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleOpen}
                        disabled={isMenuDisabled}
                    >
                    <FontDownloadIcon/>
                </IconButton>
                </Box>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    disablePadding: true
                }}
            >
                {fonts.map(({ name, css }) => (
                    <MenuItem
                    key={name}
                    onClick={() => editor.chain().focus().setFontFamily(css).run()}
                    sx={{
                        minHeight: 40,
                        px: 2,
                        py: 1,
                        width: '100%',
                    }}
                    >
                        <Typography
                            sx={{ fontFamily: css || 'inherit', fontSize: '1rem', width: '100%' }}
                            color={
                                (!css && !editor.getAttributes('textStyle').fontFamily) ||
                                editor.isActive('textStyle', { fontFamily: css }) ? 'primary' : 'text.primary'
                            }
                        >
                            {name}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

const AddListDropDownMenu=({editor})=>{
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isMenuDisabled = !editor.can().toggleBulletList() ||
        !editor.can().toggleOrderedList();

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <div>
            <Tooltip title={"Add list"}>
                <Box component={"span"}>
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleOpen}
                        disabled={isMenuDisabled}
                    >
                    <Badge
                        badgeContent={<AddIcon fontSize={"small"} color={"primary"} sx={{background: "white", borderRadius: "50%"}}/>}
                        color="default"
                        overlap="circular"
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    >
                        <ListIcon/>
                    </Badge>
                </IconButton>
                </Box>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    disablePadding: true
                }}
            >
                <Tooltip title="Bullet List">
                    <MenuItem
                        sx={{margin:0, padding:0}}
                        onClick={() => {
                            editor.chain().focus().toggleBulletList().run();
                            handleClose();
                        }}
                        disabled={!editor.can().toggleBulletList()}
                    >
                        <IconButton  color={editor.isActive('bulletList') ? 'primary' : 'default'}>
                            <BulletListIcon/>
                        </IconButton>
                    </MenuItem>
                </Tooltip>
                <Tooltip title="Ordered List">
                    <MenuItem
                        sx={{margin:0, padding:0}}
                        onClick={() => {
                            editor.chain().focus().toggleOrderedList().run();
                            handleClose();
                        }}
                        disabled={!editor.can().toggleOrderedList()}
                    >
                        <IconButton color={editor.isActive('orderedList') ? 'primary' : 'default'}><OrderedListIcon/></IconButton>
                    </MenuItem>
                </Tooltip>

            </Menu>
        </div>
    );
};

const HeadingButtons = ({editor}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const isMenuDisabled = !editor.can().toggleHeading({level: 1});

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return <div>
        <Tooltip title={"Set header level"}>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleOpen}
                disabled={isMenuDisabled}
            >
                <SvgIcon viewBox="0 0 24 24">
                    <text
                        x="12"
                        y="12"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="16"
                        fontFamily="sans-serif"
                    >
                        H
                    </text>
                </SvgIcon>
            </IconButton>
        </Tooltip>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
                disablePadding: true
            }}
        >
            {[1, 2, 3, 4, 5, 6].map(level => (
                <Tooltip title={`H${level}`}>

                    <MenuItem
                        sx={{margin: 0, padding: 0}}
                        onClick={() => editor.chain().focus().toggleHeading({level}).run()}
                    >
                        <IconButton key={level}
                                    color={editor.isActive('heading', {level}) ? 'primary' : 'default'}>
                            <Typography variant={"button"}>{`H${level}`}</Typography>
                        </IconButton>
                    </MenuItem>
                </Tooltip>
            ))}
        </Menu>
    </div>
};

const ExtendedMenuBar = ({editor, images, setImages}) => {
    if (!editor) return null;

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const objectURL = URL.createObjectURL(file);
            const imageObject = {
                file,
                url: objectURL
            };
            setImages([...images, imageObject]);
            editor.chain().focus().setImage({src: objectURL}).run();
        };

        input.click();
    };

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>
            <SimpleMenuBar editor={editor}/>
            <SetFontDropDownMenu editor={editor}/>
            <ColorPickerButton
                editor={editor}
                icon={<FormatColorTextIcon />}
                getCurrentColor={(editor) => editor.getAttributes('textStyle').color}
                applyColor={(editor, color) => editor.chain().focus().setColor(color).run()}
                disabled={!editor.can().setColor()}
                title={"Text color"}
            />
            <ColorPickerButton
                editor={editor}
                icon={<HighlightIcon />}
                getCurrentColor={(editor) => editor.getAttributes('highlight').color}
                applyColor={(editor, color) => editor.chain().focus().toggleHighlight({ color }).run()}
                disabled={!editor.can().toggleHighlight()}
                title={"Highlight color"}
            />
            <HeadingButtons editor={editor}/>
            <ButtonGroup variant={"outlined"} size={"small"}>
                <Tooltip title={"Align left"}>
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => {editor.chain().focus().toggleTextAlign('left').run()}}
                            disabled={!editor.can().toggleTextAlign()}
                            color={editor.isActive({textAlign: 'left'}) ? 'primary' : 'default'}
                        >
                            <FormatAlignLeftIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title={"Align center"}>
                    <Box component={"span"}>
                        <IconButton
                            onClick={()=>{editor.chain().focus().toggleTextAlign('center').run()}}
                            disabled={!editor.can().toggleTextAlign()}
                            color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
                        >
                            <FormatAlignCenterIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title={"Align right"}>
                    <Box component={"span"}>
                        <IconButton
                            onClick={()=>{editor.chain().focus().toggleTextAlign('right').run()}}
                            disabled={!editor.can().toggleTextAlign()}
                            color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
                        >
                            <FormatAlignRightIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title={"Align left"}>
                    <Box component={"span"}>
                        <IconButton
                            onClick={()=>{editor.chain().focus().toggleTextAlign('justify').run()}}
                            disabled={!editor.can().toggleTextAlign()}
                            color={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'}
                        >
                            <FormatAlignJustifyIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
            </ButtonGroup>
            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Inline Code">
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            disabled={!editor.can().toggleCode()}
                            color={editor.isActive('code') ? 'primary' : 'default'}>
                            <DataObjectIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Blockquote">
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            disabled={!editor.can().toggleBlockquote()}
                            color={editor.isActive('blockquote') ? 'primary' : 'default'}
                        >
                            <QuoteIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Code Block">
                    <Box component={"snap"}>
                        <IconButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            disabled={!editor.can().toggleCodeBlock()}
                            color={editor.isActive('codeBlock') ? 'primary' : 'default'}
                        >
                            <CodeIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Horizontal Rule">
                    <Box component={"snap"}>
                        <IconButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            disabled={!editor.can().setHorizontalRule()}
                        >
                            <HrIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
            </ButtonGroup>
            <Tooltip title="Clear Styles">
                <Box component={"span"}>
                    <IconButton
                        onClick={() => editor.chain().focus().unsetAllMarks().run()}
                        disabled={!editor.can().unsetAllMarks()}
                    >
                        <FormatClearIcon/>
                    </IconButton>
                </Box>
            </Tooltip>
            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Undo">
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().chain().focus().undo().run()}
                        >
                        <UndoIcon/>
                    </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Redo">
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().chain().focus().redo().run()}
                        >
                        <RedoIcon/>
                    </IconButton>
                    </Box>
                </Tooltip>
            </ButtonGroup>
            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Insert Table">
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).updateAttributes('table', {style: 'margin: 0 auto; width:100%'}).run()}
                            disabled={!editor.can().insertTable()}
                        >
                            <TableChartIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
            </ButtonGroup>
            <AlterTableDropDownMenu editor={editor}/>
            <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Merge Cells">
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => editor.chain().focus().mergeCells().run()}
                            disabled={!editor.can().mergeCells()}
                        >
                        <MergeIcon/>
                    </IconButton>
                    </Box>
                </Tooltip>
                <Tooltip title="Split Cell">
                    <Box component={"span"}>
                        <IconButton
                            onClick={() => editor.chain().focus().splitCell().run()}
                            disabled={!editor.can().splitCell()}
                        >
                            <CallSplitIcon/>
                        </IconButton>
                    </Box>
                </Tooltip>
            </ButtonGroup>
            <ButtonGroup>
                <Tooltip title="Add image">
                    <IconButton
                        onClick={addImage}
                        disabled={!editor.can().setImage()}
                    >
                        <AddPhotoAlternateIcon/>
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        </Box>
    );
};

const TextEditor = ({value, onChange, type, images, setImages, placeholder="", visible=true, minHeight, maxHeight, serverImages, setServerImages}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Link,
            Table.configure({resizable: true}),
            ImageResize,
            TableRow,
            TableCell,
            TableHeader,
            Subscript,
            Superscript,
            Placeholder.configure({placeholder: placeholder}),
            Highlight.configure({ multicolor: true }),
            FontFamily,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            ],
        content: value?.trim() ? value : null,
        onUpdate: ({editor}) => onChange(editor.getHTML()),
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(()=>{
        if(Array.isArray(serverImages) && serverImages.length===0 && type==="extended" && editor){
            const images = [];
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'image' && node.attrs.src) {
                    images.push(node.attrs.src);
                }
            });
            setServerImages(images);
        }
    },[]);
    /* eslint-disable react-hooks/exhaustive-deps */

    useEffect(() => {
        if (type==="extended" && editor) {
            const handleUpdate = () => {
                const currentImages = [];
                editor.state.doc.descendants((node) => {
                    if (node.type.name === 'image' && node.attrs.src) {
                        currentImages.push(node.attrs.src);
                    }
                });
                const filteredImages = images.filter(image => currentImages.includes(image.url));
                if (filteredImages.length !== images.length) {
                    setImages(filteredImages);
                }
            };
            editor.on('update', handleUpdate);
            return () => {
                editor.off('update', handleUpdate);
            };
        }
    }, [editor, images, setImages]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems:"center", width:'100%'}}>
            {
                type === "simple" ?
                    visible?
                        <Box sx={{ mb: 1, width:"100%", display:"flex", alignItems:"flex-start" }}>
                            <SimpleMenuBar editor={editor}/>
                        </Box>
                        :
                        editor.isFocused &&
                        <Box sx={{ mb: 1 }}>
                            <SimpleMenuBar editor={editor}/>
                        </Box>
                    :
                    <ExtendedMenuBar editor={editor} images={images} setImages={setImages}/>
            }

            <Box
                sx={{
                    width:"100%",
                    MaxWidth:"100%",
                    '& .ProseMirror': {
                        minHeight: minHeight,
                        maxHeight: maxHeight,
                        padding: '10px 10px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        borderRadius: '4px',
                        overflow: 'auto',
                    },
                    '& .ProseMirror p': {
                        margin: 0,
                    },
                }}
            >
                <EditorContent editor={editor} className="tiptap"/>
            </Box>
        </Box>
    );
};

export default TextEditor;
