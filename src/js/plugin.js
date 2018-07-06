var COLUMN_WIDTH = 16,
    BORDER_WIDTH = 1,
    MediumEditorTable;

MediumEditorTable = MediumEditor.extensions.form.extend({
    name: 'table',

    aria: 'create table',
    action: 'table',
    contentDefault: 'TBL',
    contentFA: '<i class="fa fa-table"></i>',

    init: function () {
        this.base.subscribe('editableClick', function () {
            this.hide();
        }.bind(this));

        MediumEditor.extensions.form.prototype.init.apply(this, arguments);
    },

    handleClick: function (event) {
        event.preventDefault();
        event.stopPropagation();

        this[this.isActive() === true ? 'hide' : 'show']();
    },

    hide: function () {
        this.setInactive();
        this.builder.hide();
    },

    show: function () {
        this.setActive();

        var range = MediumEditor.selection.getSelectionRange(this.document);

        /* Adding condition to limit creation of table only on medium editor */
        if (range.startContainer.parentElement.offsetParent && range.startContainer.parentElement.offsetParent.id === 'cavo-editor') {
            if (range.startContainer.nodeName.toLowerCase() === 'td' ||
                range.endContainer.nodeName.toLowerCase() === 'td' ||
                MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'td')) {
                this.builder.setEditor(MediumEditor.selection.getSelectedParentElement(range), this.restrictNestedTable);
            } else {
                this.builder.setBuilder();
            }
            this.builder.show(this.button.offsetLeft);
        }
    },

    getForm: function () {
        if (!this.builder) {
            this.builder = new Builder({
                onClick: function (rows, columns) {
                    if (rows > 0 || columns > 0) {
                        this.table.insert(rows, columns);
                    }
                    this.hide();
                }.bind(this),
                ownerDocument: this.document,
                rows: this.rows || 10,
                columns: this.columns || 10
            });

            this.table = new Table(this.base);
        }

        return this.builder.getElement();
    }
});